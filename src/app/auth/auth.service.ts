import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserData } from './auth.model';

@Injectable({providedIn: 'root'})

export class AuthService {

  constructor(private http: HttpClient) {}

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
    this.http.post('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        console.log(response);
      });
  }
}
