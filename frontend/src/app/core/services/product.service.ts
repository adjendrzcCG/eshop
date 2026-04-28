import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, PagedResponse } from '../models/api.model';
import { Product, ProductFilter } from '../models/product.model';
import { Review, ReviewRequest } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(filter?: ProductFilter): Observable<PagedResponse<Product>> {
    let params = new HttpParams();
    if (filter) {
      if (filter.page !== undefined) params = params.set('page', filter.page);
      if (filter.size !== undefined) params = params.set('size', filter.size);
      if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
      if (filter.sortDir) params = params.set('sortDir', filter.sortDir);
    }
    return this.http.get<ApiResponse<PagedResponse<Product>>>(this.apiUrl, { params })
      .pipe(map(r => r.data));
  }

  searchProducts(filter: ProductFilter): Observable<PagedResponse<Product>> {
    let params = new HttpParams();
    if (filter.keyword) params = params.set('keyword', filter.keyword);
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
    if (filter.minPrice !== undefined) params = params.set('minPrice', filter.minPrice);
    if (filter.maxPrice !== undefined) params = params.set('maxPrice', filter.maxPrice);
    if (filter.brand) params = params.set('brand', filter.brand);
    if (filter.page !== undefined) params = params.set('page', filter.page);
    if (filter.size !== undefined) params = params.set('size', filter.size);
    return this.http.get<ApiResponse<PagedResponse<Product>>>(`${this.apiUrl}/search`, { params })
      .pipe(map(r => r.data));
  }

  getFeaturedProducts(page = 0, size = 8): Observable<PagedResponse<Product>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PagedResponse<Product>>>(`${this.apiUrl}/featured`, { params })
      .pipe(map(r => r.data));
  }

  getProductsByCategory(categoryId: number, page = 0, size = 12): Observable<PagedResponse<Product>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PagedResponse<Product>>>(`${this.apiUrl}/category/${categoryId}`, { params })
      .pipe(map(r => r.data));
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`)
      .pipe(map(r => r.data));
  }

  createProduct(product: any): Observable<Product> {
    return this.http.post<ApiResponse<Product>>(this.apiUrl, product)
      .pipe(map(r => r.data));
  }

  updateProduct(id: number, product: any): Observable<Product> {
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, product)
      .pipe(map(r => r.data));
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => undefined));
  }

  getReviews(productId: number, page = 0, size = 10): Observable<PagedResponse<Review>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PagedResponse<Review>>>(`${this.apiUrl}/${productId}/reviews`, { params })
      .pipe(map(r => r.data));
  }

  addReview(productId: number, review: ReviewRequest): Observable<Review> {
    return this.http.post<ApiResponse<Review>>(`${this.apiUrl}/${productId}/reviews`, review)
      .pipe(map(r => r.data));
  }
}
