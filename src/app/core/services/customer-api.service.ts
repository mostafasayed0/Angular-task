import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiListResponse,
  ApiSingleResponse,
  Car,
  Installment,
  Order,
  PaginationQuery,
} from '../models/api.models';
import { ApiBaseService } from './api-base.service';

@Injectable({ providedIn: 'root' })
export class CustomerApiService extends ApiBaseService {
  private readonly http = inject(HttpClient);

  getCars(query: PaginationQuery): Observable<ApiListResponse<Car>> {
    return this.http.get<ApiListResponse<Car>>(`${environment.apiUrl}/customer/cars`, {
      params: this.toParams(query),
    });
  }

  getCar(id: number): Observable<ApiSingleResponse<Car>> {
    return this.http.get<ApiSingleResponse<Car>>(`${environment.apiUrl}/customer/cars/${id}`);
  }

  createOrder(payload: Partial<Order>): Observable<ApiSingleResponse<Order>> {
    return this.http.post<ApiSingleResponse<Order>>(`${environment.apiUrl}/customer/orders`, payload);
  }

  getOrders(query: PaginationQuery): Observable<ApiListResponse<Order>> {
    return this.http.get<ApiListResponse<Order>>(`${environment.apiUrl}/customer/orders`, {
      params: this.toParams(query),
    });
  }

  getOrder(id: number): Observable<ApiSingleResponse<Order>> {
    return this.http.get<ApiSingleResponse<Order>>(`${environment.apiUrl}/customer/orders/${id}`);
  }

  getInstallments(query: PaginationQuery): Observable<ApiListResponse<Installment>> {
    return this.http.get<ApiListResponse<Installment>>(`${environment.apiUrl}/customer/installments`, {
      params: this.toParams(query),
    });
  }

  payInstallment(id: number): Observable<ApiSingleResponse<Installment>> {
    return this.http.post<ApiSingleResponse<Installment>>(
      `${environment.apiUrl}/customer/installments/${id}/pay`,
      {},
    );
  }
}
