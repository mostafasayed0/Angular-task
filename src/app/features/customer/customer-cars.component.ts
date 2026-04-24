import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Car } from '../../core/models/api.models';
import { CustomerApiService } from '../../core/services/customer-api.service';
import { LoadingComponent } from '../../shared/loading.component';
import { PaginationComponent } from '../../shared/pagination.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingComponent, PaginationComponent],
  template: `
    <section class="card">
      <h2>Browse Cars</h2>
      <div class="toolbar">
        <input [(ngModel)]="search" (ngModelChange)="load(1)" placeholder="Search cars..." />
      </div>
      @if (loading()) {
        <app-loading />
      } @else if (!cars().length) {
        <p class="text-muted">No cars available right now.</p>
      } @else {
        <div class="grid grid-2">
          @for (car of cars(); track car.id) {
            <article class="card">
              <h3>{{ car.name }}</h3>
              <p class="text-muted">{{ car.brand }} {{ car.model }}</p>
              <p>{{ car.kilometers }} km</p>
              <p><strong>{{ car.price_per_day }}</strong> / day</p>
              <a [routerLink]="['/cars', car.id]">View & Rent</a>
            </article>
          }
        </div>
      }
      <app-pagination [page]="page()" [totalPages]="totalPages()" (pageChange)="load($event)" />
    </section>
  `,
})
export class CustomerCarsComponent {
  private readonly api = inject(CustomerApiService);
  protected readonly cars = signal<Car[]>([]);
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
    this.api.getCars({ page, search: this.search, per_page: 8 }).subscribe({
      next: (res) => {
        this.cars.set(res.data ?? []);
        this.totalPages.set(res.meta?.last_page ?? 1);
      },
      complete: () => this.loading.set(false),
    });
  }
}
