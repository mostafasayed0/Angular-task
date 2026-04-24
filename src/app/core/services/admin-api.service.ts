import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiListResponse,
  ApiSingleResponse,
  Car,
  Order,
  PaginationQuery,
  User,
} from '../models/api.models';
import { ApiBaseService } from './api-base.service';

@Injectable({ providedIn: 'root' })
export class AdminApiService extends ApiBaseService {
  private readonly http = inject(HttpClient);

  getUsers(query: PaginationQuery): Observable<ApiListResponse<User>> {
    return this.http.get<ApiListResponse<User>>(`${environment.apiUrl}/admin/users`, {
      params: this.toParams(query),
    });
  }

  getUser(id: number): Observable<ApiSingleResponse<User>> {
    return this.http.get<ApiSingleResponse<User>>(`${environment.apiUrl}/admin/users/${id}`);
  }

  getCars(query: PaginationQuery): Observable<ApiListResponse<Car>> {
    return this.http.get<ApiListResponse<Car>>(`${environment.apiUrl}/admin/cars`, {
      params: this.toParams(query),
    });
  }

  createCar(payload: Omit<Car, 'id'>): Observable<ApiSingleResponse<Car>> {
    return this.http.post<ApiSingleResponse<Car>>(`${environment.apiUrl}/admin/cars`, payload);
  }

  updateCar(id: number, payload: Omit<Car, 'id'>): Observable<ApiSingleResponse<Car>> {
    return this.http.put<ApiSingleResponse<Car>>(`${environment.apiUrl}/admin/cars/${id}`, payload);
  }

  deleteCar(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/cars/${id}`);
  }

  getOrders(query: PaginationQuery): Observable<ApiListResponse<Order>> {
    return this.http.get<ApiListResponse<Order>>(`${environment.apiUrl}/admin/orders`, {
      params: this.toParams(query),
    });
  }

  getOrder(id: number): Observable<ApiSingleResponse<Order>> {
    return this.http.get<ApiSingleResponse<Order>>(`${environment.apiUrl}/admin/orders/${id}`);
  }

  updateOrder(id: number, payload: Partial<Order>): Observable<ApiSingleResponse<Order>> {
    return this.http.put<ApiSingleResponse<Order>>(`${environment.apiUrl}/admin/orders/${id}`, payload);
  }
}
