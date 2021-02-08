import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../core/api.service';
import {AuthenticationService} from '../services/authentication.service';
import {AlertService} from '../services/alert.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-licenseValidate',
  templateUrl: './licenseValidate.component.html',
  styleUrls: ['./licenseValidate.component.css']
})
export class LicenseValidateComponent implements OnInit {

  licenseValidateForm: FormGroup;
  invalidLicenseValidate = false;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private apiService: ApiService,
              private authenticationService: AuthenticationService,
              private alertService: AlertService) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.licenseValidateForm = this.formBuilder.group({
      license: ['', Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.licenseValidateForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.licenseValidateForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.licenseValidate(this.f.license.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['login']);
        },
        error => {
          if (error.error === 'password expired') {
            this.router.navigate(['change-password']);
          }
          this.alertService.error(error.error, true);
          this.loading = false;
        });
  }

}
