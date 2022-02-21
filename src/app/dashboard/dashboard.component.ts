import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserService } from '../_core/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public userDetails: any;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails() {
    this.userService.getUserDetails(localStorage.getItem('userId'))
    .subscribe((response: any) => {
      this.userDetails = response.data;
      let newUrl = environment.API_URL + this.userDetails.profileImage.split("backend-service")[1].substring(1);
      this.userDetails.profileImage = newUrl.replace(/\\/g, '/');
    });
  }

}
