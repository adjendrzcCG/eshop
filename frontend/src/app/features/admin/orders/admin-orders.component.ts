import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  totalOrders = 0;
  currentPage = 0;
  loading = true;
  displayedColumns = ['orderNumber', 'user', 'status', 'total', 'date', 'actions'];
  orderStatuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders(this.currentPage).subscribe({
      next: (data) => {
        this.orders = data.content;
        this.totalOrders = data.totalElements;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  updateStatus(orderId: number, status: string): void {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: (updated) => {
        const idx = this.orders.findIndex(o => o.id === orderId);
        if (idx >= 0) this.orders[idx] = updated;
        this.snackBar.open('Order status updated', 'OK', { duration: 3000 });
      },
      error: () => this.snackBar.open('Update failed', 'OK', { duration: 3000 })
    });
  }
}
