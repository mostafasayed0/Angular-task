import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminApiService } from '../../core/services/admin-api.service';
import { User } from '../../core/models/api.models';
import { PaginationComponent } from '../../shared/pagination.component';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent, LoadingComponent],
  template: `
    <section class="card">
      <h2>Users Management</h2>
      <div class="toolbar">
        <input [(ngModel)]="search" (ngModelChange)="load(1)" placeholder="Search user..." />
      </div>
      @if (loading()) {
        <app-loading />
      } @else if (!users().length) {
        <p class="text-muted">No users found.</p>
      } @else {
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr>
          </thead>
          <tbody>
            @for (user of users(); track user.id) {
              <tr>
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td><a [routerLink]="['/admin/users', user.id]">View</a></td>
              </tr>
            }
          </tbody>
        </table>
      }
      <app-pagination [page]="page()" [totalPages]="totalPages()" (pageChange)="load($event)" />
    </section>
  `,
})
export class AdminUsersComponent {
  private readonly api = inject(AdminApiService);
  protected readonly users = signal<User[]>([]);
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
    this.api.getUsers({ page, search: this.search, per_page: 10 }).subscribe({
      next: (res) => {
        this.users.set(res.data ?? []);
        this.totalPages.set(res.meta?.last_page ?? 1);
      },
      complete: () => this.loading.set(false),
    });
  }

}
