import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {User} from "../../model/user.model";
import {UsersDatasource} from "../../core/user.datasource";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../core/api.service";
import {AuthenticationService} from "../../services/authentication.service";
import {AlertService} from "../../services/alert.service";
import {fromEvent, merge} from "rxjs";
import {debounceTime, distinctUntilChanged, tap} from "rxjs/operators";
import {GroupsDatasource} from "../../core/group.datasource";
import {Group} from "../../model/group.model";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements  OnInit  {

  searchword: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private apiService: ApiService,
              private authenticationService: AuthenticationService,
              private alertService: AlertService) { }

  ngOnInit() {
    if(!this.authenticationService.currentUserValue) {
      this.router.navigate(['login']);
      return;
    }

  }
}
