import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../core/api.service";
import {AuthenticationService} from "../../../services/authentication.service";
import {AlertService} from "../../../services/alert.service";
import {User} from "../../../model/user.model";
import { ChangePasswordComponent } from 'src/app/change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  user: User;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private apiService: ApiService,
              private authenticationService: AuthenticationService,
              public dialog: MatDialog,
              private alertService: AlertService) { }

  ngOnInit(): void {
    if(!this.authenticationService.currentUserValue) {
      this.router.navigate(['login']);
      return;
    }
    this.apiService.getUserByUserName(this.authenticationService.currentUserValue.userId).subscribe( data => {
      this.user = data.body;
    });
  }
 
  ChangePassword(): void {
    console.log("Change Password");
    
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '550px'
    });
  }

}
