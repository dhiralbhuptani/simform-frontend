import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(
    private toasterService: ToastrService,
    private userService: UserService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          if (event.body.status && event.body.message && event.body.status !== 200) {
            if (event.body.status === 401) {
              this.userService.clearAuthData();
            }
            this.toasterService.error(event.body.message, 'Error');
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.toasterService.error(error.error.message, 'Error');
        return throwError(error);
      })
    );
  }
}
