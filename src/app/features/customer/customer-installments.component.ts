import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Installment } from '../../core/models/api.models';
import { CustomerApiService } from '../../core/services/customer-api.service';
import { LoadingComponent } from '../../shared/loading.component';
import { PaginationComponent } from '../../shared/pagination.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent, PaginationComponent],
  template: `
    <section class="card">
      <h2>Installments</h2>
      <div class="toolbar">
        <input [(ngModel)]="search" (ngModelChange)="load(1)" placeholder="Search installment..." />
      </div>
      @if (loading()) {
        <app-loading />
      } @else if (!installments().length) {
        <p class="text-muted">No installments found.</p>
      } @else {
        <table>
          <thead>
            <tr><th>ID</th><th>Order</th><th>Due Date</th><th>Amount</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            @for (item of installments(); track item.id) {
              <tr>
                <td>{{ item.id }}</td>
                <td>{{ item.order_id }}</td>
                <td>{{ item.due_date }}</td>
                <td>{{ item.amount }}</td>
                <td>{{ item.status }}</td>
                <td>
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    [disabled]="item.status === 'paid'"
                    (click)="pay(item.id)"
                  >
                    Pay
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
      <app-pagination [page]="page()" [totalPages]="totalPages()" (pageChange)="load($event)" />
    </section>
  `,
})
export class CustomerInstallmentsComponent {
  private readonly api = inject(CustomerApiService);
  protected readonly installments = signal<Installment[]>([]);
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
    this.api.getInstallments({ page, search: this.search, per_page: 10 }).subscribe({
      next: (res) => {
        this.installments.set(res.data ?? []);
        this.totalPages.set(res.meta?.last_page ?? 1);
      },
      complete: () => this.loading.set(false),
    });
  }

  protected pay(id: number): void {
    this.api.payInstallment(id).subscribe(() => this.load(this.page()));
  }
}
