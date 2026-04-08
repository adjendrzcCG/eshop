import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  totalProducts = 0;
  currentPage = 0;
  loading = true;
  displayedColumns = ['id', 'name', 'sku', 'price', 'stock', 'category', 'featured', 'active', 'actions'];

  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts({ page: this.currentPage, size: 20 }).subscribe({
      next: (data) => {
        this.products = data.content;
        this.totalProducts = data.totalElements;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  deleteProduct(id: number): void {
    if (!confirm('Are you sure you want to delete this product?')) return;
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.snackBar.open('Product deleted', 'OK', { duration: 3000 });
        this.loadProducts();
      },
      error: () => this.snackBar.open('Delete failed', 'OK', { duration: 3000 })
    });
  }
}
