package com.eshop.service;

import com.eshop.dto.request.ProductRequest;
import com.eshop.dto.response.PagedResponse;
import com.eshop.dto.response.ProductImageResponse;
import com.eshop.dto.response.ProductResponse;
import com.eshop.exception.DuplicateResourceException;
import com.eshop.exception.ResourceNotFoundException;
import com.eshop.model.Category;
import com.eshop.model.Product;
import com.eshop.model.ProductImage;
import com.eshop.repository.CategoryRepository;
import com.eshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public PagedResponse<ProductResponse> getProducts(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Page<Product> products = productRepository.findByActiveTrue(PageRequest.of(page, size, sort));
        return toPagedResponse(products);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProductResponse> getProductsByCategory(Long categoryId, int page, int size) {
        Page<Product> products = productRepository.findByCategoryIdAndActiveTrue(
                categoryId, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return toPagedResponse(products);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProductResponse> getFeaturedProducts(int page, int size) {
        Page<Product> products = productRepository.findByFeaturedTrueAndActiveTrue(
                PageRequest.of(page, size));
        return toPagedResponse(products);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProductResponse> searchProducts(String keyword, Long categoryId,
                                                          BigDecimal minPrice, BigDecimal maxPrice,
                                                          String brand, int page, int size) {
        Page<Product> products = productRepository.findWithFilters(
                categoryId, minPrice, maxPrice, brand, keyword,
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return toPagedResponse(products);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return mapToResponse(product);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductBySku(String sku) {
        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "sku", sku));
        return mapToResponse(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException("Product with SKU '" + request.getSku() + "' already exists");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .sku(request.getSku())
                .price(request.getPrice())
                .salePrice(request.getSalePrice())
                .stockQuantity(request.getStockQuantity())
                .category(category)
                .brand(request.getBrand())
                .scale(request.getScale())
                .specifications(request.getSpecifications())
                .featured(request.isFeatured())
                .active(request.isActive())
                .build();

        product = productRepository.save(product);

        // Add images
        if (request.getImageUrls() != null) {
            AtomicInteger order = new AtomicInteger(0);
            final Product savedProduct = product;
            List<ProductImage> images = request.getImageUrls().stream()
                    .map(url -> ProductImage.builder()
                            .product(savedProduct)
                            .url(url)
                            .primary(url.equals(request.getPrimaryImageUrl()))
                            .sortOrder(order.getAndIncrement())
                            .build())
                    .collect(Collectors.toList());
            product.setImages(images);
            product = productRepository.save(product);
        }

        return mapToResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        if (!product.getSku().equals(request.getSku()) &&
                productRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException("Product with SKU '" + request.getSku() + "' already exists");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setSku(request.getSku());
        product.setPrice(request.getPrice());
        product.setSalePrice(request.getSalePrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(category);
        product.setBrand(request.getBrand());
        product.setScale(request.getScale());
        product.setSpecifications(request.getSpecifications());
        product.setFeatured(request.isFeatured());
        product.setActive(request.isActive());

        // Update images
        if (request.getImageUrls() != null) {
            product.getImages().clear();
            AtomicInteger order = new AtomicInteger(0);
            final Product finalProduct = product;
            request.getImageUrls().forEach(url ->
                    product.getImages().add(ProductImage.builder()
                            .product(finalProduct)
                            .url(url)
                            .primary(url.equals(request.getPrimaryImageUrl()))
                            .sortOrder(order.getAndIncrement())
                            .build()));
        }

        return mapToResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product", "id", id);
        }
        productRepository.deleteById(id);
    }

    public ProductResponse mapToResponse(Product product) {
        String primaryImageUrl = product.getImages().stream()
                .filter(ProductImage::isPrimary)
                .map(ProductImage::getUrl)
                .findFirst()
                .orElse(product.getImages().isEmpty() ? null : product.getImages().get(0).getUrl());

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .sku(product.getSku())
                .price(product.getPrice())
                .salePrice(product.getSalePrice())
                .stockQuantity(product.getStockQuantity())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .brand(product.getBrand())
                .scale(product.getScale())
                .specifications(product.getSpecifications())
                .images(product.getImages().stream()
                        .sorted((a, b) -> Integer.compare(a.getSortOrder(), b.getSortOrder()))
                        .map(img -> ProductImageResponse.builder()
                                .id(img.getId())
                                .url(img.getUrl())
                                .altText(img.getAltText())
                                .primary(img.isPrimary())
                                .sortOrder(img.getSortOrder())
                                .build())
                        .collect(Collectors.toList()))
                .primaryImageUrl(primaryImageUrl)
                .featured(product.isFeatured())
                .active(product.isActive())
                .averageRating(product.getAverageRating())
                .reviewCount(product.getReviewCount())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    private PagedResponse<ProductResponse> toPagedResponse(Page<Product> products) {
        return PagedResponse.<ProductResponse>builder()
                .content(products.getContent().stream().map(this::mapToResponse).collect(Collectors.toList()))
                .page(products.getNumber())
                .size(products.getSize())
                .totalElements(products.getTotalElements())
                .totalPages(products.getTotalPages())
                .last(products.isLast())
                .build();
    }
}
