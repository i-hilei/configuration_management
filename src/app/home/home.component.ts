import { Component, OnInit } from '@angular/core';
import  *  as  data  from  "../../assets/config/config.json";
import {ConfigService} from "../core/config.service";
import {Report} from "../model/report.model";
import {ApiService} from "../core/api.service";
import {AuthenticationService} from "../services/authentication.service";
import {AlertService} from "../services/alert.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  editableText: any;
  color: string;
  stage: string;
  report:Report;
  loading = false;

  constructor(private  configService:ConfigService,
              private apiService: ApiService,
              private authenticationService: AuthenticationService,
              private alertService: AlertService
) {
  }

  ngOnInit() {
    this.color = data.colorScheme;
    this.stage = data.stage;

    this.stage = this.configService.getConfig().stage;
    this.color = this.configService.getConfig().colorScheme;
    console.log("BaseURL is: " + this.configService.getConfig().baseUrl);

    this.loading = true;
    this.apiService.getReport()
      .subscribe( data => {
          console.log("status :" + data.status);
          console.log("status :" + data.statusText);
          this.report = data.body;
        },
        error => {

          this.alertService.error(error);
          this.loading = false;
        });
    this.loading = false;

  }

}
