import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/product.model';
import { Review } from '../../../core/models/review.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  reviews: Review[] = [];
  loading = true;
  quantity = 1;
  selectedImage: string | null = null;
  addingToCart = false;
  reviewForm: FormGroup;
  submittingReview = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      title: [''],
      comment: ['', [Validators.maxLength(2000)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(+id).subscribe({
        next: (product) => {
          this.product = product;
          this.selectedImage = product.primaryImageUrl || null;
          this.loading = false;
          this.loadReviews(product.id);
        },
        error: () => {
          this.loading = false;
          this.router.navigate(['/products']);
        }
      });
    }
  }

  loadReviews(productId: number): void {
    this.productService.getReviews(productId).subscribe({
      next: (data) => { this.reviews = data.content; }
    });
  }

  getEffectivePrice(): number {
    return this.product?.salePrice ?? this.product?.price ?? 0;
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.addingToCart = true;
    this.cartService.addItem(this.product!.id, this.quantity).subscribe({
      next: () => {
        this.addingToCart = false;
        this.snackBar.open('Added to cart!', 'View Cart', { duration: 3000 })
          .onAction().subscribe(() => this.router.navigate(['/cart']));
      },
      error: (err) => {
        this.addingToCart = false;
        this.snackBar.open(err.error?.message || 'Could not add to cart', 'OK', { duration: 3000 });
      }
    });
  }

  submitReview(): void {
    if (this.reviewForm.invalid) return;
    this.submittingReview = true;
    this.productService.addReview(this.product!.id, this.reviewForm.value).subscribe({
      next: (review) => {
        this.reviews.unshift(review);
        this.reviewForm.reset({ rating: 5 });
        this.submittingReview = false;
        this.snackBar.open('Review submitted!', 'OK', { duration: 3000 });
      },
      error: (err) => {
        this.submittingReview = false;
        this.snackBar.open(err.error?.message || 'Could not submit review', 'OK', { duration: 3000 });
      }
    });
  }

  incrementQty(): void {
    if (this.quantity < (this.product?.stockQuantity ?? 1)) this.quantity++;
  }

  decrementQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  getRatingStars(rating: number): string[] {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 'star' : 'star_border');
  }
}
