import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [
  { path: 'profile', component: ProfileComponent },
  { path: 'orders', component: OrdersComponent },
  { path: '', redirectTo: 'profile', pathMatch: 'full' }
];

@NgModule({
  declarations: [ProfileComponent, OrdersComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class AccountModule {}
