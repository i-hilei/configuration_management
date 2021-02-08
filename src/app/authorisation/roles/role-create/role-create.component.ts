import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Privilege, Role } from "../../../model/group.model";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../core/api.service";
import { AuthenticationService } from "../../../services/authentication.service";
import { AlertService } from "../../../services/alert.service";


@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.scss']
})
export class RoleCreateComponent implements OnInit {
  public roleForm: FormGroup;

  public PrivilegeList: Privilege[] = [];
  public fields: Object = { text: 'name', value: 'id' };

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
    this.roleForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      privilege: new FormControl('', [Validators.required]),
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
    return this.roleForm.controls[controlName].hasError(errorName);
  }

  public onCancel = () => {

  }

  public createRole = (roleFormValue) => {
    if (this.roleForm.valid) {
      this.executeRoleCreation(roleFormValue);
    }
  }

  private executeRoleCreation = (roleFormValue) => {
    console.log(roleFormValue);

    let selectedPrivileges = [];
    roleFormValue.privilege.forEach(ele => {
      if (this.PrivilegeList.find(f => f.id == ele))
        selectedPrivileges.push(this.PrivilegeList.find(f => f.id == ele))
    });

    debugger;
    let role: Role = {
      id: 0,
      name: roleFormValue.name,
      description: roleFormValue.description,
      roles: [],
      privileges: selectedPrivileges,
    }

    this.apiService.createRole(role).subscribe(data => {
      console.log(data);
      this.router.navigate(['/roles']);
    })
  }
}
