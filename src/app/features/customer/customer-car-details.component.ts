import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Car } from '../../core/models/api.models';
import { CustomerApiService } from '../../core/services/customer-api.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="grid grid-2">
      <div class="card">
        @if (car()) {
          <h2>{{ car()?.name }}</h2>
          <p class="text-muted">{{ car()?.brand }} {{ car()?.model }}</p>
          <p>{{ car()?.kilometers }} km</p>
          <p>Price/day: {{ car()?.price_per_day }}</p>
        }
      </div>
      <div class="card">
        <h3>Create Order</h3>
        <form [formGroup]="form" (ngSubmit)="submit()" class="grid">
          <label>Delivery Date<input type="date" formControlName="delivery_date" /></label>
          <label>Receiving Date<input type="date" formControlName="receiving_date" /></label>
          <label>Payment Type
            <select formControlName="payment_type">
              <option value="cash">Cash</option>
              <option value="visa">Visa</option>
              <option value="tamara">Tamara</option>
            </select>
          </label>
          <label>Order Type
            <select formControlName="order_type">
              <option value="full">Full</option>
              <option value="installments">Installments</option>
            </select>
          </label>
          <p><strong>Days:</strong> {{ days() }}</p>
          <p><strong>Total:</strong> {{ total() }}</p>
          @if (error()) { <p class="error">{{ error() }}</p> }
          <button class="btn btn-primary" [disabled]="form.invalid || days() <= 0">Submit Order</button>
        </form>
      </div>
    </section>
  `,
})
export class CustomerCarDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(CustomerApiService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly car = signal<Car | null>(null);
  protected readonly error = signal('');
  protected readonly form = this.fb.nonNullable.group({
    delivery_date: ['', Validators.required],
    receiving_date: ['', Validators.required],
    payment_type: ['cash' as 'cash' | 'visa' | 'tamara', Validators.required],
    order_type: ['full' as 'full' | 'installments', Validators.required],
  });

  protected readonly days = computed(() => {
    const start = new Date(this.form.value.delivery_date || '');
    const end = new Date(this.form.value.receiving_date || '');
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
    const ms = end.getTime() - start.getTime();
    return ms > 0 ? Math.ceil(ms / (1000 * 60 * 60 * 24)) : 0;
  });

  protected readonly total = computed(() => this.days() * (this.car()?.price_per_day ?? 0));

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getCar(id).subscribe((res) => this.car.set(res.data));
  }

  protected submit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api
      .createOrder({
        ...this.form.getRawValue(),
        car_id: id,
        days_count: this.days(),
        total_price: this.total(),
      })
      .subscribe({
        next: () => this.router.navigateByUrl('/orders'),
        error: (err) => this.error.set(err?.error?.message ?? 'Could not create order'),
      });
  }
}
