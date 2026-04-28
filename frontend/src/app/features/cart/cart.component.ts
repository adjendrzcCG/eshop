import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../core/services/cart.service';
import { Cart, CartItem } from '../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  loading = true;

  constructor(
    public cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cartService.loadCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    this.cartService.cart$.subscribe(cart => this.cart = cart);
  }

  updateQuantity(item: CartItem, newQty: number): void {
    if (newQty < 1) return;
    this.cartService.updateItem(item.productId, newQty).subscribe({
      error: (err) => this.snackBar.open(err.error?.message || 'Update failed', 'OK', { duration: 3000 })
    });
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.productId).subscribe({
      next: () => this.snackBar.open('Item removed', 'OK', { duration: 2000 }),
      error: () => this.snackBar.open('Remove failed', 'OK', { duration: 2000 })
    });
  }

  getShipping(): number {
    return (this.cart?.subtotal ?? 0) >= 100 ? 0 : 9.99;
  }

  getTax(): number {
    return (this.cart?.subtotal ?? 0) * 0.20;
  }

  getTotal(): number {
    return (this.cart?.subtotal ?? 0) + this.getShipping() + this.getTax();
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}
