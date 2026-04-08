import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  addingToCart = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  addToCart(event: Event): void {
    event.stopPropagation();
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.addingToCart = true;
    this.cartService.addItem(this.product.id, 1).subscribe({
      next: () => { this.addingToCart = false; },
      error: () => { this.addingToCart = false; }
    });
  }

  getEffectivePrice(): number {
    return this.product.salePrice ?? this.product.price;
  }

  getDiscountPercent(): number {
    if (!this.product.salePrice) return 0;
    return Math.round(((this.product.price - this.product.salePrice) / this.product.price) * 100);
  }

  isInStock(): boolean {
    return this.product.stockQuantity > 0;
  }
}
