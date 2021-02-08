import { Component, OnInit } from '@angular/core';
import {Application} from "../model/application.model";
import {ApiService} from "../core/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";
import {AlertService} from "../services/alert.service";

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {

  applications : Application[];

  searchText : string;
  searchword: any;
  constructor(private router: Router,
              private apiService: ApiService,
              private route: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private alertService: AlertService
) { }

  ngOnInit() {

   console.log("User in ApplicationsComponent " + this.authenticationService.currentUserValue.name)
   if(!this.authenticationService.currentUserValue) {
      this.router.navigate(['login']);
      return;
   }
  }
  createNew(): void {
    console.log("create new application");
    /*
    const dialogRef = this.dialog.open(AppsNewComponent, {
      width: '550px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      this.loadApplications();
    });
*/
  }

  searchThis() {
    console.log("searching for " + this.searchword);
  }
}
