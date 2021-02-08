import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../core/api.service";
import {AuthenticationService} from "../../services/authentication.service";
import {AlertService} from "../../services/alert.service";
import {Host} from "../../model/environment.model";

@Component({
  selector: 'app-host-cards',
  templateUrl: './host-cards.component.html',
  styleUrls: ['./host-cards.component.scss']
})
export class HostCardsComponent implements OnInit {
  hosts: Host[];
  searchword: any;

  constructor(private snackBar: MatSnackBar,
              private router: Router,
              private route: ActivatedRoute,
              private apiService: ApiService,
              private authenticationService: AuthenticationService,
              private alertService: AlertService) { }

  ngOnInit(): void {
  }

  searchThis() {

  }
}
