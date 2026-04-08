import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { UserService } from '../../core/services/user.service';
import { Cart } from '../../core/models/cart.model';
import { User } from '../../core/models/user.model';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  user: User | null = null;
  placingOrder = false;
  orderPlaced: Order | null = null;

  shippingForm: FormGroup;
  paymentForm: FormGroup;

  paymentMethods = [
    { value: 'CREDIT_CARD', label: 'Credit / Debit Card' },
    { value: 'PAYPAL', label: 'PayPal' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' }
  ];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.shippingForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: [''],
      zipCode: ['', Validators.required],
      country: ['', Validators.required]
    });

    this.paymentForm = this.fb.group({
      paymentMethod: ['CREDIT_CARD', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => this.cart = cart);
    this.cartService.loadCart().subscribe();

    this.userService.getMe().subscribe(user => {
      this.user = user;
      if (user.address) {
        this.shippingForm.patchValue(user.address);
      }
    });
  }

  getShipping(): number {
    return (this.cart?.subtotal ?? 0) >= 100 ? 0 : 9.99;
  }

  getTax(): number {
    return (this.cart?.subtotal ?? 0) * 0.20;
  }

  getTotal(): number {
    return (this.cart?.subtotal ?? 0) + this.getShipping() + this.getTax();
  }

  placeOrder(): void {
    if (this.shippingForm.invalid || this.paymentForm.invalid) return;
    this.placingOrder = true;

    const request = {
      paymentMethod: this.paymentForm.value.paymentMethod,
      shippingAddress: this.shippingForm.value,
      notes: this.paymentForm.value.notes
    };

    this.orderService.createOrder(request).subscribe({
      next: (order) => {
        this.orderPlaced = order;
        this.placingOrder = false;
        this.cartService.clearLocalCart();
      },
      error: (err) => {
        this.placingOrder = false;
        this.snackBar.open(err.error?.message || 'Could not place order', 'OK', { duration: 5000 });
      }
    });
  }
}
