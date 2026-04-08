import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, PagedResponse } from '../models/api.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMe(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/users/me`)
      .pipe(map(r => r.data));
  }

  updateProfile(profile: Partial<User>): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/users/me`, profile)
      .pipe(map(r => r.data));
  }

  getAllUsers(page = 0, size = 20): Observable<PagedResponse<User>> {
    return this.http.get<ApiResponse<PagedResponse<User>>>(`${this.apiUrl}/admin/users?page=${page}&size=${size}`)
      .pipe(map(r => r.data));
  }
}
