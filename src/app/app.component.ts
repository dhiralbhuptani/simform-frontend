import { Component } from '@angular/core';
import { UserService } from './_core/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend-app';
  public currentYear = new Date().getFullYear();
  public isUserLoggedIn: boolean = false;

  constructor(private userService: UserService) {
    this.isUserLoggedIn = this.userService.getAuthData() ? true : false;
    console.log(this.isUserLoggedIn)
  }

  doLogout() {
    this.userService.userLogout();
  }

}
