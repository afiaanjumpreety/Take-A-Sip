import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  api: string = environment.apiUrl;
  
  constructor(private http: HttpClient, public router: Router) {}

  register(firstName: string, lastName: string, designation: string,email: string, password: string) {
    return this.http
      .post<User>(`${this.api}/register`, {firstName,lastName,designation,email,password}, {observe: 'response'});
  }

  login(email: string, password: string) {
    return this.http
      .post<User>(`${this.api}/login`, {email, password}, {observe: 'response'});
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('accessToken');
    return authToken !== null ? true : false;
  }
  get getUser(): any {
    let userStr = localStorage.getItem('user');
    return userStr !== null ? JSON.parse(userStr) : false;
  }

 
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = error.error.message;
    } else {
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return (msg);
  }
}