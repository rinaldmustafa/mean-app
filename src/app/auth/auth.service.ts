import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserData } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})

export class AuthService {

  private token: string;
  private authStatusListener = new Subject<boolean>(); // listen the state constantly as a new subject, default false
  private isAuthUser = false;
  private authTimer: any;
  private userId: string;

  constructor(private http: HttpClient, private route: Router) {}

  createUser(email: string, password: string) {
      // tslint:disable-next-line: object-literal-shorthand
      const authData: UserData = {email: email, password: password};
      this.http.post('http://localhost:3000/api/user/signup', authData)
        .subscribe(response => {
          console.log(response);
        });
    }

  login(email: string, password: string) {
    // tslint:disable-next-line: object-literal-shorthand
    const authData: UserData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expireTokenTime = response.expiresIn;
          this.setAuthTime(expireTokenTime);
          this.isAuthUser = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const timeConstructed = new Date(now.getTime() + expireTokenTime * 1000);
          this.saveAuthState(token, timeConstructed, this.userId);
          this.route.navigate(['/']);
        }
      });
  }

  getToken() {
    return this.token;
  }

  getAuthStateListener() {
    return this.authStatusListener.asObservable(); // with obs we cant emit other values from other components
  }

  getIsAuth() {
    return this.isAuthUser;
  }

  getUserId() {
    return this.userId;
  }

  logOut() {
    this.token = null;
    this.isAuthUser = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.authTimer);
    this.clearAuthData();
    this.route.navigate(['/']);
  }

  private saveAuthState(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString()); // meth date to string
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
  }

  private setAuthTime(duration: number) {
    console.log('Settings duration:' + duration);
    this.authTimer = setTimeout(() => {
      this.logOut();
   }, duration * 1000 );
  }

   autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expireIn = authInformation.expireDate.getTime() - now.getTime();
    if (expireIn > 0) {
      this.token = authInformation.token;
      this.isAuthUser = true;
      this.userId = authInformation.userId;
      this.setAuthTime(expireIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expireDate = localStorage.getItem('expirationDate');
    const userId = localStorage.getItem('userId');
    if (!token || !expireDate) {
      return;
    }
    return {
      // tslint:disable-next-line: object-literal-shorthand
      token: token,
      expireDate : new Date(expireDate),
      // tslint:disable-next-line: object-literal-shorthand
      userId: userId
    };
  }
}
