import { Injectable } from '@angular/core';
import { HttpHandler, HttpRequest } from '@angular/common/http';
import { UserService } from './user.service';

const TOKEN_HEADER_KEY = "Authorization";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  constructor(private userService: UserService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authReq = req;
    authReq = req.clone({
      headers: req.headers.set("Content-Type", "application/json")
    });
    const token = localStorage["token"];
    if (token) {
      authReq = req.clone({
        headers: req.headers.set(TOKEN_HEADER_KEY, token)
      });
    }
    return next.handle(authReq);
  }

}
