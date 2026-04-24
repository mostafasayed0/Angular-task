import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PaginationQuery } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApiBaseService {
  protected readonly apiUrl = environment.apiUrl;

  protected toParams(query: PaginationQuery): HttpParams {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return params;
  }
}
