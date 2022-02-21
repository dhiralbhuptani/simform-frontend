import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { UserService } from '../_core/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  public imageURL: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private toasterService: ToastrService,
    private userService: UserService
  ) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      profileImage: [''],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userService.getUserDetails(localStorage.getItem('userId'))
    .subscribe((response: any) => {
      if (response.data) {
        this.profileForm.patchValue({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          password: response.data.password
        });
        let newUrl = environment.API_URL + response.data.profileImage.split("backend-service")[1].substring(1);
        this.imageURL = newUrl.replace(/\\/g, '/');
      }
    });
  }

  onSelectFile(event, type) {
    console.log("file type", type)
    if (event.target.files && event.target.files[0]) {
      const extension = event.target.files[0].type;
      if ('image/jpg' == extension || 'image/png' == extension || 'image/jpeg' == extension) {
        this.profileForm.get(type).setValue(event.target["files"][0])
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        reader.onload = (event) => { // called once readAsDataURL is completed
          if (type === 'productImage')
            this.imageURL = event.target.result.toString();
        }
      }
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      let formData = new FormData();
      formData.append('firstName', this.profileForm.get('firstName').value);
      formData.append('lastName', this.profileForm.get('lastName').value);
      formData.append('email', this.profileForm.get('email').value);
      formData.append('profileImage', this.profileForm.get('profileImage').value);
      formData.append('password', this.profileForm.get('password').value);
      
      this.userService.updateUserDetails(formData)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.toasterService.success(response.message, 'Success');
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        }
      });
    }
  }

}
