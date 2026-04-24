import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminApiService } from '../../core/services/admin-api.service';
import { Car } from '../../core/models/api.models';
import { PaginationComponent } from '../../shared/pagination.component';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PaginationComponent, LoadingComponent],
  template: `
    <section class="grid grid-2">
      <div class="card">
        <h2>{{ editingId() ? 'Edit Car' : 'Create Car' }}</h2>
        <form [formGroup]="form" (ngSubmit)="save()" class="grid">
          <input placeholder="Name" formControlName="name" />
          <input placeholder="Brand" formControlName="brand" />
          <input placeholder="Model" formControlName="model" />
          <input placeholder="Kilometers" type="number" formControlName="kilometers" />
          <input placeholder="Price per day" type="number" formControlName="price_per_day" />
          @if (formError()) {
            <p class="error">{{ formError() }}</p>
          }
          <button class="btn btn-primary" [disabled]="form.invalid">{{ editingId() ? 'Update' : 'Create' }}</button>
        </form>
      </div>
      <div class="card">
        <h2>Cars</h2>
        <div class="toolbar"><input placeholder="Search..." [value]="search()" (input)="onSearch($event)" /></div>
        @if (loading()) {
          <app-loading />
        } @else if (!cars().length) {
          <p class="text-muted">No cars found.</p>
        } @else {
          <table>
            <thead>
              <tr><th>Name</th><th>Brand</th><th>Model</th><th>Km</th><th>Price/day</th><th>Actions</th></tr>
            </thead>
            <tbody>
              @for (car of cars(); track car.id) {
                <tr>
                  <td>{{ car.name }}</td>
                  <td>{{ car.brand }}</td>
                  <td>{{ car.model }}</td>
                  <td>{{ car.kilometers }}</td>
                  <td>{{ car.price_per_day }}</td>
                  <td>
                    <button type="button" class="btn btn-secondary btn-sm" (click)="edit(car)">Edit</button>
                    <button type="button" class="btn btn-danger btn-sm" (click)="remove(car.id)">Delete</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
        <app-pagination [page]="page()" [totalPages]="totalPages()" (pageChange)="load($event)" />
      </div>
    </section>
  `,
})
export class AdminCarsComponent {
  private readonly api = inject(AdminApiService);
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    brand: ['', Validators.required],
    model: ['', Validators.required],
    kilometers: [0, Validators.required],
    price_per_day: [0, Validators.required],
  });
  protected readonly cars = signal<Car[]>([]);
  protected readonly loading = signal(false);
  protected readonly editingId = signal<number | null>(null);
  protected readonly formError = signal('');
  protected readonly search = signal('');
  protected readonly page = signal(1);
  protected readonly totalPages = signal(1);

  constructor() {
    this.load(1);
  }

  protected load(page: number): void {
    this.loading.set(true);
    this.page.set(page);
    this.api.getCars({ page, search: this.search(), per_page: 10 }).subscribe({
      next: (res) => {
        this.cars.set(res.data ?? []);
        this.totalPages.set(res.meta?.last_page ?? 1);
      },
      complete: () => this.loading.set(false),
    });
  }

  protected save(): void {
    if (this.form.invalid) return;
    const payload = this.form.getRawValue();
    const req = this.editingId()
      ? this.api.updateCar(this.editingId() as number, payload)
      : this.api.createCar(payload);
    req.subscribe({
      next: () => {
        this.form.reset({ name: '', brand: '', model: '', kilometers: 0, price_per_day: 0 });
        this.editingId.set(null);
        this.load(this.page());
      },
      error: (err) => this.formError.set(err?.error?.message ?? 'Unable to save car'),
    });
  }

  protected edit(car: Car): void {
    this.editingId.set(car.id);
    this.form.patchValue(car);
  }

  protected remove(id: number): void {
    this.api.deleteCar(id).subscribe(() => this.load(this.page()));
  }

  protected onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search.set(value);
    this.load(1);
  }
}
