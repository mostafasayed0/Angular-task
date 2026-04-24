import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = typeof localStorage !== 'undefined' ? localStorage : null;
  private readonly tokenState = signal<string | null>(this.storage?.getItem('token') ?? null);
  private readonly userState = signal<User | null>(
    this.storage?.getItem('user') ? JSON.parse(this.storage.getItem('user') as string) : null,
  );

  readonly token = computed(() => this.tokenState());
  readonly user = computed(() => this.userState());

  login(payload: LoginPayload): Observable<User> {
    const isAdminEmail = payload.email.trim().toLowerCase() === 'admin@admin.com';
    const path = isAdminEmail ? '/admin/login' : '/customer/login';
    return this.http.post<AuthResponse>(`${environment.apiUrl}${path}`, payload).pipe(
      tap((res) => this.persistAuth(res)),
      map((res) => res.user),
    );
  }

  register(payload: RegisterPayload): Observable<User> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/customer/register`, payload).pipe(
      tap((res) => this.persistAuth(res)),
      map((res) => res.user),
    );
  }

  logout(): void {
    this.tokenState.set(null);
    this.userState.set(null);
    this.storage?.removeItem('token');
    this.storage?.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.tokenState();
  }

  isAdmin(): boolean {
    return this.userState()?.role === 'admin';
  }

  isCustomer(): boolean {
    return this.userState()?.role === 'customer';
  }

  private persistAuth(res: AuthResponse): void {
    this.tokenState.set(res.token);
    this.userState.set(res.user);
    this.storage?.setItem('token', res.token);
    this.storage?.setItem('user', JSON.stringify(res.user));
  }
}
