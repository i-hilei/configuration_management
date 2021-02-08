import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Role, Group } from "../../../model/group.model";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../core/api.service";
import { AuthenticationService } from "../../../services/authentication.service";
import { AlertService } from "../../../services/alert.service";

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit {
  public groupForm: FormGroup;

  public RoleList: Role[] = [];
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
    this.loadRoles();
    this.groupForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      role: new FormControl('', [Validators.required]),
    });
  }

  loadRoles() {
    this.apiService.findRoles('', 'asc', 0, 1000)
      .pipe().subscribe(result => {
        console.log(result);
        this.RoleList = result['data'];
        return result['data'];
      });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.groupForm.controls[controlName].hasError(errorName);
  }

  public onCancel = () => {

  }

  public createGroup = (groupFormValue) => {
    if (this.groupForm.valid) {
      this.executeGroupCreation(groupFormValue);
    }
  }

  private executeGroupCreation = (groupFormValue) => {
    console.log(groupFormValue);
    let selectedRoles = [];
    groupFormValue.role.forEach(ele => {
      if (this.RoleList.find(f => f.id == ele))
        selectedRoles.push(this.RoleList.find(f => f.id == ele))
    });

    debugger;
    let group: Group = {
      id: 0,
      name: groupFormValue.name,
      description: groupFormValue.description,
      groups: [],
      roles: selectedRoles,
    }

    this.apiService.createGroup(group).subscribe(data => {
      console.log(data);
      this.router.navigate(['/groups']);
    })
  }
}
