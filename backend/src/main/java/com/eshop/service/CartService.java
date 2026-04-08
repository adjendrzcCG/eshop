package com.eshop.service;

import com.eshop.dto.request.CartItemRequest;
import com.eshop.dto.response.CartItemResponse;
import com.eshop.dto.response.CartResponse;
import com.eshop.exception.BadRequestException;
import com.eshop.exception.ResourceNotFoundException;
import com.eshop.model.Cart;
import com.eshop.model.CartItem;
import com.eshop.model.Product;
import com.eshop.model.User;
import com.eshop.repository.CartRepository;
import com.eshop.repository.ProductRepository;
import com.eshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return mapToResponse(cart);
    }

    @Transactional
    public CartResponse addItem(Long userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        if (!product.isActive()) {
            throw new BadRequestException("Product is not available");
        }
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock. Available: " + product.getStockQuantity());
        }

        Optional<CartItem> existing = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.getProductId()))
                .findFirst();

        if (existing.isPresent()) {
            int newQty = existing.get().getQuantity() + request.getQuantity();
            if (newQty > product.getStockQuantity()) {
                throw new BadRequestException("Insufficient stock. Available: " + product.getStockQuantity());
            }
            existing.get().setQuantity(newQty);
        } else {
            CartItem item = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(item);
        }

        cartRepository.save(cart);
        return mapToResponse(cart);
    }

    @Transactional
    public CartResponse updateItem(Long userId, Long productId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock. Available: " + product.getStockQuantity());
        }

        CartItem item = cart.getItems().stream()
                .filter(ci -> ci.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        item.setQuantity(request.getQuantity());
        cartRepository.save(cart);
        return mapToResponse(cart);
    }

    @Transactional
    public CartResponse removeItem(Long userId, Long productId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        cartRepository.save(cart);
        return mapToResponse(cart);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart != null) {
            cart.getItems().clear();
            cartRepository.save(cart);
        }
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
            Cart cart = Cart.builder().user(user).build();
            return cartRepository.save(cart);
        });
    }

    private CartResponse mapToResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(this::mapItemToResponse)
                .collect(Collectors.toList());

        BigDecimal subtotal = items.stream()
                .map(CartItemResponse::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = items.stream()
                .mapToInt(CartItemResponse::getQuantity)
                .sum();

        return CartResponse.builder()
                .id(cart.getId())
                .items(items)
                .subtotal(subtotal)
                .totalItems(totalItems)
                .build();
    }

    private CartItemResponse mapItemToResponse(CartItem item) {
        Product p = item.getProduct();
        BigDecimal effectivePrice = p.getSalePrice() != null ? p.getSalePrice() : p.getPrice();
        String primaryImg = p.getImages().stream()
                .filter(productImage -> productImage.isPrimary())
                .map(img -> img.getUrl())
                .findFirst()
                .orElse(p.getImages().isEmpty() ? null : p.getImages().get(0).getUrl());

        return CartItemResponse.builder()
                .id(item.getId())
                .productId(p.getId())
                .productName(p.getName())
                .productSku(p.getSku())
                .productImageUrl(primaryImg)
                .productPrice(p.getPrice())
                .productSalePrice(p.getSalePrice())
                .quantity(item.getQuantity())
                .lineTotal(effectivePrice.multiply(BigDecimal.valueOf(item.getQuantity())))
                .availableStock(p.getStockQuantity())
                .build();
    }
}
