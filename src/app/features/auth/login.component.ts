import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TranslatePipe } from '../../shared/translate.pipe';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  template: `
    <div class="auth-page">
    <section class="card">
      <h2>{{ 'login' | t }}</h2>
      <form [formGroup]="form" (ngSubmit)="submit()" class="grid">
        <div>
          <label>Email</label>
          <input formControlName="email" type="email" />
        </div>
        <div>
          <label>Password</label>
          <input formControlName="password" type="password" />
        </div>
        @if (error()) {
          <p class="error">{{ error() }}</p>
        }
        <button class="btn btn-primary" [disabled]="form.invalid || loading()">
          {{ loading() ? '...' : ('login' | t) }}
        </button>
      </form>
      <p class="text-muted">No account? <a routerLink="/register">Register</a></p>
    </section>
    </div>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl(this.auth.isAdmin() ? '/admin/users' : '/cars'),
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Login failed');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }
}
