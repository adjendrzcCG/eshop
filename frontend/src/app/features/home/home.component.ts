import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  categories: Category[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.productService.getFeaturedProducts(0, 8).subscribe({
      next: (data) => {
        this.featuredProducts = data.content;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    this.categoryService.getRootCategories().subscribe(cats => {
      this.categories = cats;
    });
  }
}
