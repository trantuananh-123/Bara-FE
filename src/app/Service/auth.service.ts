import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../Model/user';

const headers = new HttpHeaders().set('Content-Type', 'application/json');

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private base_URL = 'http://localhost:8080/api/auth/';

  userRoles: string = '';
  constructor(private http: HttpClient, private router: Router) {}
  signup(user: User): Observable<any> {
    //console.log('In AuthService');
    return this.http
      .post(this.base_URL + 'signup', user, { headers, responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  uniqueUsername(username: string): Observable<any> {
    return this.http.get(this.base_URL + 'checkusername/' + username);
  }

  uniqueUserEmail(email: string): Observable<any> {
    return this.http.get(this.base_URL + 'checkuseremail/' + email);
  }

  loginNoSave(user: string, password: string) {
    // console.log('In AuthService -  login');
    return this.http
      .post<any>(
        this.base_URL + 'login',
        { username: user, password: password },
        { headers }
      )
      .pipe(
        catchError(this.handleError),
        map((userData) => {
          sessionStorage.setItem('username', user);
          let tokenStr = 'Bearer ' + userData.token;
          console.log('Token---  ' + tokenStr);
          sessionStorage.setItem('id', userData.id);
          sessionStorage.setItem('token', tokenStr);
          sessionStorage.setItem('roles', JSON.stringify(userData.roles));
          sessionStorage.setItem('email', userData.email);
          sessionStorage.setItem('phone', userData.phone);
          sessionStorage.setItem('address', userData.address);
          sessionStorage.setItem('avatar', userData.avatar);
          sessionStorage.setItem('balance', userData.balance);
          sessionStorage.setItem('dob', userData.dob);
          sessionStorage.setItem('status', userData.status);
          // console.log(userData);
          return userData;
        })
      );
  }

  loginSave(user: string, password: string) {
    // console.log('In AuthService -  login');
    return this.http
      .post<any>(
        this.base_URL + 'login',
        { username: user, password: password },
        { headers }
      )
      .pipe(
        catchError(this.handleError),
        map((userData) => {
          localStorage.setItem('username', user);
          let tokenStr = 'Bearer ' + userData.token;
          console.log('Token---  ' + tokenStr);
          localStorage.setItem('id', userData.id);
          localStorage.setItem('token', tokenStr);
          localStorage.setItem('roles', JSON.stringify(userData.roles));
          localStorage.setItem('email', userData.email);
          localStorage.setItem('phone', userData.phone);
          localStorage.setItem('address', userData.address);
          localStorage.setItem('avatar', userData.avatar);
          localStorage.setItem('balance', userData.balance);
          localStorage.setItem('dob', userData.dob);
          localStorage.setItem('status', userData.status);
          // console.log(userData);
          return userData;
        })
      );
  }

  logout() {
    if (sessionStorage.getItem('token') != null) sessionStorage.clear();
    if (localStorage.getItem('token') != null) localStorage.clear();
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    this.userRoles =
      sessionStorage.getItem('roles')! || localStorage.getItem('roles')!;
    if (this.userRoles != null && this.userRoles.includes('ROLE_ADMIN')) {
      return true;
    } else return false;
  }

  isLoggedIn(): boolean {
    return (
      sessionStorage.getItem('username') !== null ||
      localStorage.getItem('username') !== null
    );
  }

  private handleError(httpError: HttpErrorResponse) {
    let message: string = '';

    if (httpError.error instanceof ProgressEvent) {
      console.log('in progrss event');
      message = 'Network error';
    } else {
      message = httpError.error;
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${httpError.status}, ` +
          `body was: ${httpError.error}`
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(message);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.base_URL}signup/${id}`);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.base_URL}signup/${id}`, user);
  }

  public isExpired(): boolean {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      const token = sessionStorage.getItem('token');
      const expiredTime = new Date().getTime() + 300000;
      console.log(new Date().getTime());
      return Math.floor(new Date().getTime()) >= expiredTime;
    }
  }

  isAuthenticated(): boolean {
    return this.isAdmin();
  }
  cartSubject = new Subject<any>();

  cartItem = new Subject<any>();

  totalCart = new Subject<any>();
}
