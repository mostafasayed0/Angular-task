import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { User, UserRole } from '../../core/models/api.models';
import { AdminApiService } from '../../core/services/admin-api.service';

type AdminUserDetail = User & {
  created_at?: string;
  updated_at?: string;
};

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="card">
      <div class="toolbar" style="margin-bottom: 0.75rem;">
        <a class="back-link" routerLink="/admin/users">← Back to users</a>
      </div>
      <h2>User #{{ user()?.id ?? '…' }}</h2>
      @if (loading()) {
        <p class="text-muted">Loading...</p>
      } @else if (error()) {
        <p class="error">{{ error() }}</p>
      } @else if (!user()) {
        <p class="text-muted">User not found.</p>
      } @else {
        <p><strong>Name:</strong> {{ user()?.name }}</p>
        <p><strong>Email:</strong> {{ user()?.email }}</p>
        <p><strong>Role:</strong> {{ user()?.role }}</p>
        @if (user()?.phone) {
          <p><strong>Phone:</strong> {{ user()?.phone }}</p>
        }
        @if (user()?.created_at) {
          <p class="text-muted"><small>Created: {{ user()?.created_at }}</small></p>
        }
        @if (user()?.updated_at) {
          <p class="text-muted"><small>Updated: {{ user()?.updated_at }}</small></p>
        }
      }
    </section>
  `,
})
export class AdminUserDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(AdminApiService);

  protected readonly user = signal<AdminUserDetail | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id) || id <= 0) {
      this.loading.set(false);
      this.error.set('Invalid user id.');
      return;
    }

    this.api
      .getUser(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          const payload = res as unknown as {
            data?: AdminUserDetail;
            user?: AdminUserDetail;
            id?: number;
            role?: UserRole;
          };
          const candidate = payload.data ?? payload.user ?? (res as unknown as AdminUserDetail);
          if (candidate && typeof candidate === 'object' && 'id' in candidate && 'email' in candidate) {
            this.user.set(candidate as AdminUserDetail);
            return;
          }
          this.error.set('User payload is empty.');
        },
        error: () => this.error.set('Failed to load user.'),
      });
  }
}
