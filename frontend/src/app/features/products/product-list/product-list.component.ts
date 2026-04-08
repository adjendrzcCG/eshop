import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product, ProductFilter } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { PagedResponse } from '../../../core/models/api.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  totalProducts = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 12;
  loading = false;
  private destroy$ = new Subject<void>();

  filterForm = new FormGroup({
    keyword: new FormControl(''),
    categoryId: new FormControl<number | null>(null),
    minPrice: new FormControl<number | null>(null),
    maxPrice: new FormControl<number | null>(null),
    brand: new FormControl(''),
    sortBy: new FormControl('createdAt'),
    sortDir: new FormControl('desc')
  });

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getRootCategories().subscribe(cats => {
      this.categories = cats;
    });

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['keyword']) this.filterForm.patchValue({ keyword: params['keyword'] });
      if (params['categoryId']) this.filterForm.patchValue({ categoryId: +params['categoryId'] });
      this.loadProducts();
    });

    this.filterForm.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadProducts();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.loading = true;
    const values = this.filterForm.value;
    const filter: ProductFilter = {
      keyword: values.keyword || undefined,
      categoryId: values.categoryId || undefined,
      minPrice: values.minPrice || undefined,
      maxPrice: values.maxPrice || undefined,
      brand: values.brand || undefined,
      page: this.currentPage,
      size: this.pageSize,
      sortBy: values.sortBy || 'createdAt',
      sortDir: values.sortDir || 'desc'
    };

    this.productService.searchProducts(filter).subscribe({
      next: (data) => {
        this.products = data.content;
        this.totalProducts = data.totalElements;
        this.totalPages = data.totalPages;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  clearFilters(): void {
    this.filterForm.reset({
      sortBy: 'createdAt',
      sortDir: 'desc'
    });
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}
