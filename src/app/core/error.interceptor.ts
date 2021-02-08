import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthenticationService} from '../services/authentication.service';
import {AlertService} from '../services/alert.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private alertService: AlertService,
              private snackBar: MatSnackBar) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {

      if (err.status === 401) {
        if (err.error === 'password expired') {
          this.router.navigate(['/change-password']);
        } else {
          // auto logout if 401 response returned from api
          this.authenticationService.logout();
          location.reload(true);
        }
      }

      if (err.error) {
        console.log('ErrorInterceptor' + err.statusText);
        this.snackBar.open(err.error, 'Ok', {
          duration: 3000,
          verticalPosition: 'top', // Allowed values are  'top' | 'bottom'
          horizontalPosition: 'end', // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
          panelClass: ['blue-snackbar']
        });
      }
      return throwError(err);
    }));
  }
}
