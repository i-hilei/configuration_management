import { Component, OnInit } from '@angular/core';
import { Environment } from "../../model/environment.model";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../core/api.service";
import { AuthenticationService } from "../../services/authentication.service";
import { AlertService } from "../../services/alert.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { User } from "../../model/user.model";
import { orderBy } from 'lodash';

@Component({
  selector: 'app-environment-cards',
  templateUrl: './environment-cards.component.html',
  styleUrls: ['./environment-cards.component.scss']
})
export class EnvironmentCardsComponent implements OnInit {
  environments: Environment[];
  users: User[];
  loading = false;
  searchword: any;

  constructor(private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) { }

  ngOnInit() {
    console.log(" in EnvironmentCardsComponent ")

    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['login']);
      return;
    }
    this.loading = true;
    this.apiService.getEnvironments()
      .subscribe(data => {
        //this.applications = data;
        console.log("status :" + data.status);
        console.log("status :" + data.statusText);
        this.environments = data.body;
      },
        error => {

          this.alertService.error(error);
          this.loading = false;
        });

    this.loading = true;
    this.apiService.getUsers()
      .subscribe(data => {
        console.log("status :" + data.status);
        console.log("status :" + data.statusText);
        this.users = data.body;
      },
        error => {

          this.alertService.error(error);
          this.loading = false;
        });
    this.loading = false;
  }

  searchThis() {
    this.loading = true;
    this.apiService.searchForEnvironments(this.searchword)
      .subscribe(data => {
        this.environments = data.body;
      },
        error => {

          this.alertService.error(error);
          this.loading = false;
        });

  }

  dynamicSort(e) {
    console.log(e);
    this.environments = orderBy(this.environments, 'id');
    var list = [{ id: 1, type: 'DEVELPOMENT' }, { id: 2, type: 'INTEGRATION' }, { id: 3, type: 'UAT' }, { id: 4, type: 'PRODUCTION' }, { id: 5, type: 'OTHER' }, { id: 6, type: 'TEMPORARY' }, { id: 7, type: 'UNKNOWN' },];
    
    if(e.value == 'identifier,type,name'){
      this.dynamicSort('identifier');
      this.dynamicSort('type');
      this.dynamicSort('name');
    }
    else if (e.value == 'type') {
      this.environments.forEach(ele => {
        if (list.find(f => f.type == ele.type))
          ele['typeId'] = list.find(f => f.type == ele.type).id;
        else
          ele['typeId'] = 99;
      })
      this.environments = orderBy(this.environments, 'typeId');
    }     
    else {
      if (e.value == 'identifier') {
        this.environments.forEach(ele => {
          if (!(ele.identifier) && ele['applicationIdentifier'] && ele['applicationIdentifier'][0]) {
            ele.identifier = ele['applicationIdentifier'][0]['identifier']
          }
        });
      }

      this.environments = orderBy(this.environments, e.value);
    }
  }
}
