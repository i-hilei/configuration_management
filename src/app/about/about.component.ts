import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../core/api.service";
import {AuthenticationService} from "../services/authentication.service";
import {AlertService} from "../services/alert.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {License} from "../model/license.model";
import {ApplicationVersionInformation} from "../model/applicationversioninformation.model";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  loading = false;
  license : License;
  version : ApplicationVersionInformation;

  constructor(private snackBar: MatSnackBar,
              private router: Router,
              private route: ActivatedRoute,
              private apiService: ApiService,
              private authenticationService: AuthenticationService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.loading = true;
    this.apiService.getLicense()
      .subscribe( data => {
          this.license = data.body;
        },
        error => {

          this.alertService.error(error);
          this.loading = false;
        });

    this.apiService.getApplicationImplementationVersion()
      .subscribe( data => {
          this.version = data.body;
        },
        error => {

          this.alertService.error(error);
          this.loading = false;
        });

  }
}
