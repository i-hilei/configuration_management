import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, config, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../model/user.model';

import { ConfigService } from '../core/config.service';


import *  as  data from '../../assets/config/config.json';


@Injectable({ providedIn: 'root' })
export class AuthenticationService implements OnInit {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  config: any;
  baseUrl = '';


  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = data.baseUrl;
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

  }

  ngOnInit() {
    this.baseUrl = this.configService.getConfig().baseUrl;
    console.log('setting baseURL in ApiService to ' + this.configService.getConfig().baseUrl);
  }


  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  licenseValidate(license) {
    return this.http.post(this.baseUrl + '/api/konfigure/license', { license });
  }

  changePassword(oldPassword, newPassword) {
    return this.http.post(this.baseUrl + '/api/authorization/persons/change-password', { oldPassword, newPassword });
  }

  login(username, password) {

    return this.http.post<any>(this.baseUrl + '/api/authorization/token/generate-token', { username, password })
      .pipe(map(user => {
        if (!(user.userId))
          user.userId = user.userid;
        console.log(user);
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
