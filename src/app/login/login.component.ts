import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../core/api.service';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from '../services/alert.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  invalidLogin = false;
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
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {

          // this.router.navigate(['applications']);
          this.router.navigate([this.returnUrl]);
        },
        error => {
          if (error.status === 402) {
            this.alertService.error(error, true);
            this.router.navigate(['license-validate']);
          }
          else if (error.error === 'password expired') {
            this.router.navigate(['change-password']);
          }
          this.alertService.error(error.error, true);
          this.loading = false;
        });
  }

  onSubmit_OLD() {
    if (this.loginForm.invalid) {
      return;
    }
    const loginPayload = {
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value
    };
    this.apiService.login(loginPayload).subscribe(data => {
      console.log('login data ' + data);
      console.log('login data result' + data.result);
      console.log('login data result token' + data.result.token);
      // debugger;

      if (data.status === 200) {
        window.localStorage.setItem('token', data.result);
        // this.router.navigate(['list-user']);
        this.router.navigate(['applications']);
      } else {
        this.invalidLogin = true;
        alert(data.message);
      }
    });
  }


}
