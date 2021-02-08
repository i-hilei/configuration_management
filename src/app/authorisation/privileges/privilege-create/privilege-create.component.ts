import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Privilege} from "../../../model/group.model";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../core/api.service";
import {AuthenticationService} from "../../../services/authentication.service";
import {AlertService} from "../../../services/alert.service";

@Component({
  selector: 'app-privilege-create',
  templateUrl: './privilege-create.component.html',
  styleUrls: ['./privilege-create.component.scss']
})
export class PrivilegeCreateComponent implements OnInit {
  public privilegeForm: FormGroup;

  public autoreactiveskillset: string[] = [
    'ASP.NET', 'ActionScript', 'Basic',
    'C++' , 'C#' , 'dBase' , 'Delphi' ,
    'ESPOL' , 'F#' , 'FoxPro' , 'Java',
    'J#' , 'Lisp' , 'Logo' , 'PHP'
  ];

  public privilegeActions: string[] = ['CREATE','READ','UPDATE','DELETE','READ_CONFIDENTIAL','APPROVE','APPROVE_CONFIDENTIAL','EXPORT','IMPORT'];

  public autoreactiveplaceholder: String = 'Select domain';

  public domainOptions:string [] =[
    'ALL',
    'APPLICATION',
    'VERSION',
    'CONFIGURATION',
//    'CONFIGURATIONITEM',
//    'CONFIGURATIONITEMVALUE',
//    'SCOPE_GLOBAL',
//    'SCOPE_ENVIRONMENT',
//    'SCOPE_HOST',
//    'SCOPE_PROCESS',
    'ENVIRONMENT',
    'HOST',
    'USER',
    'GROUP',
    'ROLE',
    'PERMISSION',
    'PRIVILEGE',
  ];


  constructor(private router: Router,
              private route: ActivatedRoute,
              private apiService: ApiService,
              private authenticationService: AuthenticationService,
              private alertService: AlertService) {
  }

  ngOnInit(): void
  {
    if(!this.authenticationService.currentUserValue) {
      this.router.navigate(['login']);
      return;
    }

    this.privilegeForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      type: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      permission: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      domain: new FormControl('', [Validators.required]),
      actions: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.maxLength(100)])
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.privilegeForm.controls[controlName].hasError(errorName);
  }

  public onCancel = () => {

  }

  public createPrivilege = (privilegeFormValue) => {
    if (this.privilegeForm.valid) {
      this.executePrivilegeCreation(privilegeFormValue);
    }
  }

  private executePrivilegeCreation = (privilegeFormValue) => {

    let privilege: Privilege = {
      id:0,
      name: privilegeFormValue.name,
      description: privilegeFormValue.description,
      type: privilegeFormValue.type,
      permission: privilegeFormValue.permission,
      domain: privilegeFormValue.domain,
      actions: privilegeFormValue.actions
    }

    this.apiService.createPrivilege(privilege).subscribe(data => {
      console.log(data);
      this.router.navigate(['privileges']);
    })
  }
}
