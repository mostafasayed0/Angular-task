import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { Order } from '../../core/models/api.models';
import { CustomerApiService } from '../../core/services/customer-api.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card">
      <h2>Order Details</h2>
      @if (loading()) {
        <p class="text-muted">Loading...</p>
      } @else if (error()) {
        <p class="error">{{ error() }}</p>
      } @else if (!order()) {
        <p class="text-muted">Order details not found.</p>
      } @else {
        <p><strong>Order:</strong> #{{ order()?.id }}</p>
        <p><strong>Car ID:</strong> {{ order()?.car_id }}</p>
        <p><strong>Delivery:</strong> {{ order()?.delivery_date }}</p>
        <p><strong>Receiving:</strong> {{ order()?.receiving_date }}</p>
        <p><strong>Days:</strong> {{ order()?.days_count }}</p>
        <p><strong>Total:</strong> {{ order()?.total_price }}</p>
        <p><strong>Payment:</strong> {{ order()?.payment_type }} / {{ order()?.order_type }}</p>
      }
    </section>
  `,
})
export class CustomerOrderDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(CustomerApiService);
  protected readonly order = signal<Order | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id) || id <= 0) {
      this.loading.set(false);
      this.error.set('Invalid order id.');
      return;
    }

    this.api
      .getOrder(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          const payload = res as unknown as {
            data?: Order & { days?: number };
            order?: Order & { days?: number };
            id?: number;
            days?: number;
            days_count?: number;
          };

          const candidate = payload.data ?? payload.order ?? payload;
          if (candidate && typeof candidate === 'object' && 'id' in candidate) {
            this.order.set({
              ...(candidate as Order),
              days_count:
                (candidate as Order & { days?: number }).days_count ??
                (candidate as Order & { days?: number }).days,
            });
            return;
          }

          this.error.set('Order payload is empty.');
        },
        error: () => this.error.set('Failed to load order details.'),
      });
  }
}
