import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { UserService } from '../../../core/services/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats = {
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    recentOrders: [] as any[]
  };
  loading = true;

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    forkJoin({
      products: this.productService.getProducts(),
      orders: this.orderService.getAllOrders(0, 5),
      users: this.userService.getAllUsers(0, 1)
    }).subscribe({
      next: (results) => {
        this.stats.totalProducts = results.products.totalElements;
        this.stats.totalOrders = results.orders.totalElements;
        this.stats.totalUsers = results.users.totalElements;
        this.stats.recentOrders = results.orders.content;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
