import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Group, Privilege, Role } from "../../../model/group.model";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../core/api.service";
import { AuthenticationService } from "../../../services/authentication.service";
import { AlertService } from "../../../services/alert.service";
import { User, UserResponse } from "../../../model/user.model";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  public UserForm: FormGroup;

  public PrivilegeList: Privilege[] = [];
  GroupList: Group[] = [];
  public fields1: Object = { text: 'name', value: 'id' };
  StatusList = ["ACTIVE", "DECOMISSIONED", "LOCKED", "PASSIVE", "TOBEREVIEWEDAFTERIMPORT"];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) {
  }

  ngOnInit(): void {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['login']);
      return;
    }
    this.loadPrivileges();
    this.apiService.findGroups('', 'asc', 0, 1000).subscribe(result => {
      this.GroupList = result['data'];
    });
    this.UserForm = new FormGroup({
      userId: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      name: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      preName: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      isTechnical: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      group: new FormControl('', [Validators.required]),
    });
  }

  loadPrivileges() {
    this.apiService.findPrivileges('', 'asc', 0, 1000)
      .pipe().subscribe(result => {
        console.log(result);
        this.PrivilegeList = result['data'];
        return result['data'];
      });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.UserForm.controls[controlName].hasError(errorName);
  }

  public onCancel = () => {

  }

  public createUser = (UserFormValue) => {
    if (this.UserForm.valid) {

      console.log(UserFormValue);

      let selectedGroups = [];
      UserFormValue.group.forEach(ele => {
        if (this.GroupList.find(f => f.id == ele))
          selectedGroups.push(this.GroupList.find(f => f.id == ele))
      });

      debugger;
      let user: User = new User();
      user.id = 0;
      user.userId = UserFormValue.userId;
      user.name = UserFormValue.name;
      user.preName = UserFormValue.preName;
      user.email = UserFormValue.email;
      user['password'] = UserFormValue.password;
      user.technical = UserFormValue.isTechnical;
      user.status = UserFormValue.status;
      user.groups = selectedGroups;

      this.apiService.createUser(user).subscribe(data => {
        console.log(data);
        this.router.navigate(['/users']);
      })
    }
  }
}
