/*
 *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *       THIS MATERIAL IS PROPRIETARY  TO  EDUARD VAN DEN BONGARD
 *       AND IS  NOT TO BE REPRODUCED, USED OR  DISCLOSED  EXCEPT
 *       IN ACCORDANCE  WITH  PROGRAM  LICENSE  OR  UPON  WRITTEN
 *       AUTHORIZATION  OF  EDUARD VAN DEN BONGARD, AM STIRKENBEND 20
 *       41352 KORSCHENBROICH, GERMANY.
 *
 *       THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *       EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 *       OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 *       IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
 *       ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 *       TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 *       SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *       COPYRIGHT (C) 2013-21 EDUARD VAN DEN BONGARD
 *
 *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA, NgModule, Injectable, QueryList, ViewChildren, ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";


import {
  Observable,
  BehaviorSubject,
  Subject,
  asapScheduler,
  pipe,
  of,
  from,
  interval,
  merge,
  fromEvent
} from "rxjs";
import { combineLatest, debounceTime, distinctUntilChanged, tap } from "rxjs/operators";


import { Applicationconfigurationmodal } from "./applicationconfigurationmodal/applicationconfigurationmodal.component";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { ActionEventArgs, ActionBeginEventArgs, InPlaceEditorComponent, ValidateEventArgs, ActionBlur } from "@syncfusion/ej2-angular-inplace-editor";
import { Application, Tag } from "../../model/application.model";
import { Configuration, ConfigurationItem, ConfigurationItemValue, Version } from "../../model/configuration.model";
import { ConfigurationItemsDatasource } from "../../core/configurationitems.datasource";
import { ApiService } from "../../core/api.service";
import { AuthenticationService } from "../../services/authentication.service";
import { AlertService } from "../../services/alert.service";
import { isBoolean, isString } from 'util';
import { isNumeric } from 'rxjs/internal-compatibility';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-applicationconfiguration',
  templateUrl: './applicationconfiguration.component.html',
  styleUrls: ['./applicationconfiguration.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]

})

export class ApplicationconfigurationComponent implements OnInit, AfterViewInit {
  application: Application;

  version: Version;

  configuration: Configuration;

  dataSource: ConfigurationItemsDatasource;

  //displayedColumns = ['name', 'key','isConfidential','tags','scope','values','action'];
  //displayedColumns = ['name', 'key','isConfidential','tags','scope','values'];
  displayedColumns = ['name', 'isConfidential', 'tags', 'scope', 'values'];

  isDisabled = true;

  configCount = 100;

  public infrastructureOptions = [
    { key: 'GLOBAL', value: 'GLOBAL' },
    { key: 'ENVIRONMENT', value: 'ENVIRONMENT' },
    { key: 'SERVER', value: 'SERVER' }//,
    //    {key: 'PROCESS', value: 'PROCESS'}
  ];

  booleanoptions = [
    { key: true, value: 'true' },
    { key: false, value: 'false' }
  ];

  public fields: object = { text: 'value' };
  public model: object = { dataSource: this.infrastructureOptions, fields: this.fields, placeholder: 'Select an option' };

  public booleanModel: object = { dataSource: this.booleanoptions, fields: this.fields, placeholder: 'Select an option' };

  tag: Tag;

  selectedEnvironmentToApprove: number;

  expandedElement: ConfigurationItem | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input', { static: false }) input: ElementRef;

  @ViewChild('element') editObj: InPlaceEditorComponent;

  @ViewChildren('element') passwords: QueryList<InPlaceEditorComponent>;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    private snackBar: MatSnackBar) {
    this.route.params.subscribe(params => console.log(params));

  }

  ngOnInit() {
    console.log("User in ApplicationconfigurationComponent " + this.authenticationService.currentUserValue.name)
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['login']);
      return;
    }

    this.application = this.route.snapshot.data["application"];
    this.version = this.route.snapshot.data["version"];
    this.configuration = this.route.snapshot.data["configuration"];

    this.dataSource = new ConfigurationItemsDatasource(this.apiService);

    this.route.paramMap.subscribe(params => {
      console.log(params.get('applicationid'));
      console.log(params.get('configurationid'));
      this.dataSource.loadConfigurations(params.get('applicationid'), params.get('configurationid'), '', 'asc', 0, 20);
    });

  }

  ngAfterViewInit() {

    this.passwords.forEach(password => console.log(password));

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;

          this.loadConfigurationsPage();
        })
      )
      .subscribe();

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadConfigurationsPage())
      )
      .subscribe();

    this.paginator.page.pipe(tap(() => this.loadConfigurationsPage())).subscribe();

  }

  refresh() {
    this.loadConfigurationsPage();
    this.changeDetectorRefs.detectChanges();
  }

  openDialog(config) {
    this.dialog.open(Applicationconfigurationmodal, {
      width: '90%',
      data: config
    });
  }



  loadConfigurationsPage() {
    console.log("loading configurations for applicationId " + this.application.id + " and configurationId " + this.configuration.id);
    this.dataSource.loadConfigurations(
      "" + this.application.id,
      "" + this.configuration.id,
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize);

  }

  // To Edit Employee
  editConfiguration(configid, configuration) {
    //this.router.navigate([`/Crud/edit/${configid}`]);
    this.isDisabled = false;
    this.openDialog([configuration]);
  }

  onItemAdded($event: Tag, id: number) {
    console.log($event);

    this.apiService.getTagByNameOrCreate($event.tag)
      .subscribe(data => {
        console.log("status: " + data.status);
        console.log("data: " + data.body.tag);
        this.tag = data.body;

        this.apiService.addTagToConfigurationItem(id, this.tag.id)
          .subscribe(data => {
            console.log(data);
          });
      })
  }

  onItemRemoved($event: Tag, id: number) {
    console.log("removing tag with id " + $event.id);
    this.apiService.removeTagFromConfigurationItem(id, $event.id).subscribe(data => {
      console.log(data);
    });
  }

  /**
   *
   * @param $event
   * @param configurationItemId
   */
  save(e: ActionEventArgs, configurationItemId: number) {
    console.log("about to change the scope of configurationItem " + configurationItemId + " to " + e.value);
    this.apiService.updateScopeForConfigurationItem(configurationItemId, e.value).subscribe(data => {
      console.log(data);
      this.refresh();
    })
  }

  /**
   * 1. aktualisiere Value
   *
   * @param $event
   * @param configurationItemValueId
   */
  saveConfigurationItemValue(e: ActionEventArgs, configurationItemValue: ConfigurationItemValue, type: string) {
    console.log(configurationItemValue);
    const configurationItemValue1: ConfigurationItemValue = new ConfigurationItemValue();
    configurationItemValue1.value = e.value.trim();
    configurationItemValue.infrastructureComponent = null;

    console.log(" updating configurationItemValue " + configurationItemValue.id + "with '" + e.value.trim() + "'");
    this.apiService.updateValueForConfigurationItemValue(configurationItemValue.id, "{\"value\":\"" + e.value.trim() + "\"}").subscribe(data => {
      console.log(data);
      this.refresh();
    })

  }

  public validating(e: ValidateEventArgs, type: string): void {

    switch (type) {

      case 'URL':
        let regExp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
        if (!this.isValid(e.data.value, regExp)) {
          e.errorMessage = "invalid input. URL must have a '://'";
          return;
        }

        if (!e.data.value.toString().includes("://")) {
          e.errorMessage = "invalid input. URL must have a '://'";
          return;
        }
        break;

      case 'STRING':
        if (!isString(e.data.value)) {
          e.errorMessage = "invalid input. Enter Valid STRING Value.";
          return;
        }
        break;

      case 'BOOLEAN':
        if (Boolean(e.data.value) === true || Boolean(e.data.value) === false) { }
        if (isBoolean(e.data.value)) {
          e.errorMessage = "invalid input. Enter Valid BOOLEAN Value.";
          return;
        }
        break;

      case 'INT':
        let regExpNum = '^[0-9]+$';
        if (!this.isValidNumeric(e.data.value, regExpNum)) {
          e.errorMessage = "invalid input. Enter Valid INT Value.";
          return;
        }
        break;

      case 'USER':
        break;

      case 'PASSWORD':
        break;

      case 'UNKNOWN':
        break;

      case 'DBCONNECTIONSTRING':
        let regExpDb = /([^;=]+)=[^;]+/gm;
        if (!this.isValid(e.data.value, regExpDb)) {
          e.errorMessage = "invalid input. Enter Valid DB CONNECTION STRING Value.";
          return;
        }
        break;

      case 'PATH':

        break;

      case 'PORT':
        let regExpPort = '^[0-9]+$';
        if (!(this.isValidNumeric(e.data.value, regExpPort) && isNumeric(e.data.value) || 1 > Number(e.data.value) || Number(e.data.value) > 65535)) {
          e.errorMessage = "invalid input. Enter Valid PORT Value.";
          return;
        }
        break;

      case 'HOST':
        let regExp1 = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/gm;
        if (!this.isValid(e.data.value, regExp1)) {
          e.errorMessage = "invalid input. Enter Valid Host Value.";
          return;
        }
        break;

      case 'FQDN':
        let regExp2 = /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$)/gm;
        if (!this.isValid(e.data.value, regExp2)) {
          e.errorMessage = "invalid input. Enter Valid FQDN Value.";
          return;
        }
        break;

      // case 'EMAIL':
      //   let regExp3 = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$)/gm;
      //   if (!this.isValid(e.data.value, regExp3)) {
      //     e.errorMessage = "invalid input. Enter Valid Email Value.";
      //     return;
      //   }
      //   break;

      case 'TIMEOUT':
        let regExpTimeOut = '^[0-9]+$';
        if (!this.isValidNumeric(e.data.value, regExpTimeOut)) {
          e.errorMessage = "invalid input. Enter Valid TIMEOUT Value."
          return;
        }
        break;

      default:
        break;
    }
  }

  isValid(string, regExp) {
    var res = string.match(regExp);
    return (res !== null)
  };

  isValidNumeric(number, regExpNumber) {
    var validNumeric = number.match(regExpNumber);
    return (validNumeric !== null)
  };

  errroMessage(error) {
    this.snackBar.open(error, 'Ok', {
      duration: 30000,
      verticalPosition: 'top', // Allowed values are  'top' | 'bottom'
      horizontalPosition: 'right', // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
      panelClass: ['blue-snackbar']
    });

  }
  public actionBegin(e: ActionBeginEventArgs, configurationItemValueId: number): void {
    console.log("actionBegin checking info for id " + configurationItemValueId);
    //this.passwords.forEach(password => console.log(password.element.querySelector('#password')));

    for (let password of this.passwords) {
      if (password.element.querySelector('#password') != null) {
        console.log("found password " + password.value);
        const value = (<any>password.element.querySelector('#password')).value;
        console.log("found value " + value);
        password.value = value;
        (<any>e).value = value;
        console.log(" updating configurationItemValue " + configurationItemValueId + "with " + value);
        this.apiService.updateValueForConfigurationItemValue(configurationItemValueId, "{\"value\":\"" + value + "\"}").subscribe(data => {
          console.log(data);
        })
      }
    }

  }

  approve(configurationItemId: number) {
    this.apiService.approveConfigurationItemValue(configurationItemId).subscribe(data => {
      console.log(data);
      this.refresh();
    })
  }

  approvePerEnvironment(configurationId: number) {
    console.log("approving for " + this.selectedEnvironmentToApprove + " and configuration " + configurationId);
    this.apiService.approveConfigurationForEnvironment(this.selectedEnvironmentToApprove, configurationId).subscribe(data => {
      console.log(data);
      this.refresh();
    })
  }
}
