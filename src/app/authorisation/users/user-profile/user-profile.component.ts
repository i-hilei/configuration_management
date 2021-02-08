import { Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../core/api.service";
import {AuthenticationService} from "../../../services/authentication.service";
import {AlertService} from "../../../services/alert.service";
import {User} from "../../../model/user.model";
import {ActionEventArgs} from "@syncfusion/ej2-angular-inplace-editor";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit
{
  user: User;
  loggedInUser : User;

  statusOptions =[
    {key: 'ACTIVE', value: 'ACTIVE'},
    {key: 'DECOMISSIONED', value: 'DECOMISSIONED'},
    {key: 'LOCKED', value: 'LOCKED'},
    {key: 'PASSIVE', value: 'PASSIVE'},
    {key: 'TOBEREVIEWEDAFTERIMPORT', value: 'TOBEREVIEWEDAFTERIMPORT'}
  ];
  public fields: object = { text: 'value' };
  public statusModel: object = { dataSource: this.statusOptions, fields: this.fields, placeholder: 'Select an option'};


  constructor(private router: Router,
              private route: ActivatedRoute,
              private apiService: ApiService,
              private authenticationService: AuthenticationService,
              private alertService: AlertService) { }

  ngOnInit() {

    if(!this.authenticationService.currentUserValue) {
      this.router.navigate(['login']);
      return;
    }
    this.user = this.route.snapshot.data.user;
    console.log("In UserProfileComponent " + this.route.snapshot.data.user.userId);

    this.loggedInUser = this.authenticationService.currentUserValue;

    console.log("LoggedIn User is " + this.loggedInUser.userId);
  }

  save(e: ActionEventArgs, user: User) {
    console.log(" updating user " +  user.id + "with " + e.value);
    this.apiService.updateStatusForUser(user,e.value).subscribe(data => {
      console.log(data);
    })
  }

}
