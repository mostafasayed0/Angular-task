import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CustomerApiService } from '../../core/services/customer-api.service';
import { Order } from '../../core/models/api.models';
import { PaginationComponent } from '../../shared/pagination.component';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent, LoadingComponent],
  template: `
    <section class="card">
      <h2>My Orders</h2>
      <div class="toolbar">
        <input [(ngModel)]="search" (ngModelChange)="load(1)" placeholder="Search order..." />
      </div>
      @if (loading()) {
        <app-loading />
      } @else if (!orders().length) {
        <p class="text-muted">You have no orders yet.</p>
      } @else {
        <table>
          <thead>
            <tr><th>ID</th><th>Car</th><th>Total</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            @for (order of orders(); track order.id) {
              <tr>
                <td>{{ order.id }}</td>
                <td>{{ order.car_id }}</td>
                <td>{{ order.total_price }}</td>
                <td>{{ order.payment_status || 'pending' }}</td>
                <td><a [routerLink]="['/orders', order.id]">Details</a></td>
              </tr>
            }
          </tbody>
        </table>
      }
      <app-pagination [page]="page()" [totalPages]="totalPages()" (pageChange)="load($event)" />
    </section>
  `,
})
export class CustomerOrdersComponent {
  private readonly api = inject(CustomerApiService);
  protected readonly orders = signal<Order[]>([]);
  protected readonly loading = signal(false);
  protected readonly page = signal(1);
  protected readonly totalPages = signal(1);
  protected search = '';

  constructor() {
    this.load(1);
  }

  protected load(page: number): void {
    this.loading.set(true);
    this.page.set(page);
    this.api.getOrders({ page, search: this.search, per_page: 10 }).subscribe({
      next: (res) => {
        this.orders.set(res.data ?? []);
        this.totalPages.set(res.meta?.last_page ?? 1);
      },
      complete: () => this.loading.set(false),
    });
  }
}
