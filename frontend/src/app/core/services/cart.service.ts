import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api.model';
import { Cart } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly apiUrl = `${environment.apiUrl}/cart`;
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  get cartItemCount(): number {
    return this.cartSubject.value?.totalItems ?? 0;
  }

  loadCart(): Observable<Cart> {
    return this.http.get<ApiResponse<Cart>>(this.apiUrl).pipe(
      map(r => r.data),
      tap(cart => this.cartSubject.next(cart))
    );
  }

  addItem(productId: number, quantity: number): Observable<Cart> {
    return this.http.post<ApiResponse<Cart>>(`${this.apiUrl}/items`, { productId, quantity }).pipe(
      map(r => r.data),
      tap(cart => this.cartSubject.next(cart))
    );
  }

  updateItem(productId: number, quantity: number): Observable<Cart> {
    return this.http.put<ApiResponse<Cart>>(`${this.apiUrl}/items/${productId}`, { productId, quantity }).pipe(
      map(r => r.data),
      tap(cart => this.cartSubject.next(cart))
    );
  }

  removeItem(productId: number): Observable<Cart> {
    return this.http.delete<ApiResponse<Cart>>(`${this.apiUrl}/items/${productId}`).pipe(
      map(r => r.data),
      tap(cart => this.cartSubject.next(cart))
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<ApiResponse<void>>(this.apiUrl).pipe(
      map(() => undefined),
      tap(() => this.cartSubject.next(null))
    );
  }

  clearLocalCart(): void {
    this.cartSubject.next(null);
  }
}
