import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, PagedResponse } from '../models/api.model';
import { Order, OrderRequest } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createOrder(request: OrderRequest): Observable<Order> {
    return this.http.post<ApiResponse<Order>>(`${this.apiUrl}/orders`, request)
      .pipe(map(r => r.data));
  }

  getMyOrders(page = 0, size = 10): Observable<PagedResponse<Order>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PagedResponse<Order>>>(`${this.apiUrl}/orders`, { params })
      .pipe(map(r => r.data));
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<ApiResponse<Order>>(`${this.apiUrl}/orders/${id}`)
      .pipe(map(r => r.data));
  }

  getAllOrders(page = 0, size = 20): Observable<PagedResponse<Order>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PagedResponse<Order>>>(`${this.apiUrl}/admin/orders`, { params })
      .pipe(map(r => r.data));
  }

  updateOrderStatus(id: number, status: string): Observable<Order> {
    const params = new HttpParams().set('status', status);
    return this.http.put<ApiResponse<Order>>(`${this.apiUrl}/admin/orders/${id}/status`, null, { params })
      .pipe(map(r => r.data));
  }
}
