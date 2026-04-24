import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Car, Installment, Order } from '../../core/models/api.models';
import { AdminApiService } from '../../core/services/admin-api.service';

type AdminOrderDetail = Order & {
  days?: number;
  points?: number;
  car?: Car;
  installments?: Installment[];
  created_at?: string;
  updated_at?: string;
};

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="card">
      <div class="toolbar" style="margin-bottom: 0.75rem;">
        <a class="back-link" routerLink="/admin/orders">← Back to orders</a>
      </div>
      <h2>Order #{{ order()?.id ?? '…' }}</h2>
      @if (loading()) {
        <p class="text-muted">Loading...</p>
      } @else if (error()) {
        <p class="error">{{ error() }}</p>
      } @else if (!order()) {
        <p class="text-muted">Order not found.</p>
      } @else {
        <div class="grid grid-2">
          <div>
            <p><strong>User ID:</strong> {{ order()?.user_id }}</p>
            <p><strong>Delivery:</strong> {{ order()?.delivery_date }}</p>
            <p><strong>Receiving:</strong> {{ order()?.receiving_date }}</p>
            <p><strong>Days:</strong> {{ order()?.days_count }}</p>
            <p><strong>Total:</strong> {{ order()?.total_price }}</p>
            @if (order()?.points != null) {
              <p><strong>Points:</strong> {{ order()?.points }}</p>
            }
            <p>
              <strong>Payment:</strong> {{ order()?.payment_type }} / {{ order()?.order_type }}
            </p>
            <p><strong>Status:</strong> {{ order()?.payment_status || 'pending' }}</p>
            @if (order()?.created_at) {
              <p class="text-muted"><small>Created: {{ order()?.created_at }}</small></p>
            }
          </div>
          @if (order()?.car) {
            <div class="surface" style="padding: 1rem;">
              <h3 style="margin-top: 0;">Car</h3>
              <p><strong>{{ order()?.car?.brand }} {{ order()?.car?.name }}</strong></p>
              <p class="text-muted">Model {{ order()?.car?.model }}</p>
              <p>Km: {{ order()?.car?.kilometers }}</p>
              <p>Price/day: {{ order()?.car?.price_per_day }}</p>
            </div>
          } @else {
            <p><strong>Car ID:</strong> {{ order()?.car_id }}</p>
          }
        </div>
        @if (order()?.installments?.length) {
          <h3 style="margin-top: 1.25rem;">Installments</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Due</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (row of order()!.installments!; track row.id) {
                <tr>
                  <td>{{ row.id }}</td>
                  <td>{{ row.due_date }}</td>
                  <td>{{ row.amount }}</td>
                  <td>{{ row.status }}</td>
                </tr>
              }
            </tbody>
          </table>
        }
        <div style="margin-top: 1rem;">
          @if (actionError()) {
            <p class="error">{{ actionError() }}</p>
          }
          <button
            type="button"
            class="btn btn-primary btn-sm"
            [disabled]="markingPaid() || order()?.payment_status === 'paid'"
            (click)="markPaid()"
          >
            {{ markingPaid() ? '…' : 'Mark as paid' }}
          </button>
        </div>
      }
    </section>
  `,
})
export class AdminOrderDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(AdminApiService);

  protected readonly order = signal<AdminOrderDetail | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly markingPaid = signal(false);
  protected readonly actionError = signal<string | null>(null);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id) || id <= 0) {
      this.loading.set(false);
      this.error.set('Invalid order id.');
      return;
    }

    this.fetchOrder(id);
  }

  private fetchOrder(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.api
      .getOrder(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          const payload = res as unknown as {
            data?: AdminOrderDetail;
            order?: AdminOrderDetail;
            id?: number;
          };
          const candidate = payload.data ?? payload.order ?? (res as unknown as AdminOrderDetail);
          if (candidate && typeof candidate === 'object' && 'id' in candidate) {
            const o = candidate as AdminOrderDetail;
            this.order.set({
              ...o,
              days_count: o.days_count ?? o.days,
            });
            return;
          }
          this.error.set('Order payload is empty.');
        },
        error: () => this.error.set('Failed to load order.'),
      });
  }

  protected markPaid(): void {
    const id = this.order()?.id;
    if (!id) return;
    this.actionError.set(null);
    this.markingPaid.set(true);
    this.api.updateOrder(id, { payment_status: 'paid' }).subscribe({
      next: () => {
        this.order.update((o) => (o ? { ...o, payment_status: 'paid' } : o));
        this.markingPaid.set(false);
      },
      error: () => {
        this.markingPaid.set(false);
        this.actionError.set('Could not update payment status.');
      },
    });
  }
}
