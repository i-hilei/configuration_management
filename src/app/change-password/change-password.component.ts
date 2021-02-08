import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../core/api.service';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from '../services/alert.service';
import { first } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  invalidPassword = false;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private alertService: AlertService) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      // this.router.navigate(['/']);
    }
  }

  checkPasswords(group: FormGroup) {
    const oldPassword = group.get('oldPassword').value;
    const newPassword = group.get('newPassword').value;
    const confirmPassword = group.get('confirmPassword').value;
    let errors = {};
    console.log(`old: ${oldPassword} new: ${newPassword} confirm: ${confirmPassword}`);
    if (newPassword !== confirmPassword) {
      errors = { ...errors, notSame: true };
    }
    if (oldPassword.length > 0 && newPassword === oldPassword) {
      errors = { ...errors, sameAsOldPassword: true };
    }
    return errors;
  }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.changePasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.changePassword(this.changePasswordForm.controls.oldPassword.value,
      this.changePasswordForm.controls.newPassword.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success("Password changed sucessfully")
          // this.router.navigate(['applications']);
          this.dialogRef.close();
          this.authenticationService.logout();
          this.router.navigate(['/login']);

        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }


  
}
