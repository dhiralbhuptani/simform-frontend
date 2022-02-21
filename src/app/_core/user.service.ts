import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { RegisterUser, LoginUser } from '../_shared/models/user.model'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private authStatusListener = new Subject<boolean>();
  private isAuthenticated: boolean = false;
  private token: string;
  private userId: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toasterService: ToastrService
  ) { }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  registerUser(firstName: string, lastName: string, email: string, password: string) {
    const registerData: RegisterUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };
    this.http
    .post(`${environment.API_URL}api/users/register`, registerData)
    .subscribe((response: any) => {
      this.toasterService.success(response.message, 'Success');
      this.router.navigate(['/login']);
    }, error => {
      console.log(`registration error: ${error}`);
      this.authStatusListener.next(false);
    });
  }

  userLogin(email: string, password: string) {
    const authData: LoginUser = {
      email: email,
      password: password
    };
    this.http
    .post(`${environment.API_URL}api/users/login`, authData)
    .subscribe((response: any) => {
      this.toasterService.success(response.message, 'Success');
      const apiToken = response.token;
      this.token = apiToken;
      if (apiToken) {        
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListener.next(true);
        this.saveAuthData(apiToken, this.userId);
        this.router.navigate(['/dashboard']);
      }
    }, error => {
      console.log(`login error: ${error}`);
      this.authStatusListener.next(false);
    });
  }

  userLogout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/login']);
    this.userId = null;
    this.clearAuthData();
  }

  getUserDetails(userId: string) {
    return this.http.get(`${environment.API_URL}api/users/get-user-details/${userId}`);
  }

  updateUserDetails(formData: any) {
    return this.http.put(`${environment.API_URL}api/users/update-user`, formData);
  }

  private saveAuthData(token: string, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
  }
  
  getAuthData() {    
    return localStorage.getItem('userId');
  }

  clearAuthData() {
    this.router.navigate(['/login']);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

}
