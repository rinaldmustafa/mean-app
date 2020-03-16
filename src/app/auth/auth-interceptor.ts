import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable() // service in service call
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler ) { // outgoing req, next for other req
    const authToken = this.auth.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    }); // we clone it to avoid side effects and unwanted errors, bearer is a convention we see
    return next.handle(authRequest); // allow req to continue without being changed
  }
}
