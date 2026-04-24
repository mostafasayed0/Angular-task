export type UserRole = 'admin' | 'customer';

export interface ApiListResponse<T> {
  data: T[];
  meta?: {
    total?: number;
    current_page?: number;
    per_page?: number;
    last_page?: number;
  };
}

export interface ApiSingleResponse<T> {
  data: T;
  message?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  kilometers: number;
  price_per_day: number;
}

export interface Order {
  id: number;
  user_id: number;
  car_id: number;
  delivery_date: string;
  receiving_date: string;
  days_count: number;
  total_price: number;
  payment_type: 'cash' | 'visa' | 'tamara';
  order_type: 'full' | 'installments';
  payment_status?: string;
}

export interface Installment {
  id: number;
  order_id: number;
  due_date: string;
  amount: number;
  status: 'paid' | 'pending';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaginationQuery {
  page?: number;
  per_page?: number;
  search?: string;
  filter?: string;
}
