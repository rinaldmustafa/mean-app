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
    this.http.post<{token: string}>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          this.isAuthUser = true;
          this.authStatusListener.next(true);
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

  logOut() {
    this.token = null;
    this.isAuthUser = false;
    this.authStatusListener.next(false);
    this.route.navigate(['/']);
  }
}
