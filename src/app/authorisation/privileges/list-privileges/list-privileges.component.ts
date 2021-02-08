import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Privilege} from "../../../model/group.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../core/api.service";
import {AuthenticationService} from "../../../services/authentication.service";
import {AlertService} from "../../../services/alert.service";
import {fromEvent, merge} from "rxjs";
import {debounceTime, distinctUntilChanged, tap} from "rxjs/operators";
import {PrivilegesDatasource} from "../../../core/privilege.datasource";
import {ActionEventArgs} from "@syncfusion/ej2-angular-inplace-editor";

@Component({
  selector: 'app-list-privileges',
  templateUrl: './list-privileges.component.html',
  styleUrls: ['./list-privileges.component.scss']
})
export class ListPrivilegesComponent implements OnInit, AfterViewInit {

  dataSource: PrivilegesDatasource;

  displayedColumns = ['name','description','type','permission','domain','actions','commands'];

  isDisabled = true;

  configCount = 100;

  // defined the array of data
  public dataActions: string[] = ['CREATE','READ','UPDATE','DELETE','READ_CONFIDENTIAL','APPROVE','APPROVE_CONFIDENTIAL','EXPORT','IMPORT'];
  // set placeholder to MultiSelect input element
  public placeholderActions: string = 'Select an action';

// define the JSON of data
  public countries: { [key: string]: Object; }[] = [
    { Name: 'Create', Code: 'CREATE' },
    { Name: 'Read', Code: 'READ' },
    { Name: 'Read Confidential', Code: 'READ_CONFIDENTIAL' },
    { Name: 'Update', Code: 'UPDATE' },
    { Name: 'Delete', Code: 'DELETE' },
    { Name: 'Approve', Code: 'APPROVE' },
    { Name: 'Approve Confidential', Code: 'APPROVE_CONFIDENTIAL' },
    { Name: 'Export', Code: 'EXPORT' },
    { Name: 'Import', Code: 'IMPORT' }
  ];
  // maps the local data column to fields property
  public localFields: Object = { text: 'Name', value: 'Code' };
  // set the placeholder to MultiSelect Dropdown input element
  public localWaterMark: string = 'Select an action';

  public value: string[] = ["CREATE"];
  public box : string = 'Box';


  domainOptions =[
    {key: 'ALL', value: 'ALL'},
    {key: 'APPLICATION', value: 'APPLICATION'},
    {key: 'VERSION', value: 'VERSION'},
    {key: 'CONFIGURATION', value: 'CONFIGURATION'},
//    {key: 'CONFIGURATIONITEM', value: 'CONFIGURATIONITEM'},
//    {key: 'CONFIGURATIONITEMVALUE', value: 'CONFIGURATIONITEMVALUE'},
//    {key: 'SCOPE_GLOBAL', value: 'SCOPE_GLOBAL'},
//    {key: 'SCOPE_ENVIRONMENT', value: 'SCOPE_ENVIRONMENT'},
//      {key: 'SCOPE_HOST', value: 'SCOPE_HOST'},
//    {key: 'SCOPE_PROCESS', value: 'SCOPE_PROCESS'},
    {key: 'ENVIRONMENT', value: 'ENVIRONMENT'},
    {key: 'HOST', value: 'HOST'},
    {key: 'USER', value: 'USER'},
    {key: 'GROUP', value: 'GROUP'},
    {key: 'ROLE', value: 'ROLE'},
    {key: 'PERMISSION', value: 'PERMISSION'},
    {key: 'PRIVILEGE', value: 'PRIVILEGE'}
  ];

  public fields: object = { text: 'value' };

  public domainModel: object = { dataSource: this.domainOptions, fields: this.fields, placeholder: 'Select a domain'};


  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  @ViewChild('input', {static: false}) input: ElementRef;




  constructor(private router: Router,
              private route: ActivatedRoute,
              private apiService: ApiService,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit() {
    if(!this.authenticationService.currentUserValue) {
      this.router.navigate(['login']);
      return;
    }

    this.dataSource = new PrivilegesDatasource(this.apiService);
    this.dataSource.loadPrivileges( '','asc', 0, 20);

  }

  ngAfterViewInit() {

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;

          this.loadPrivilegesPage();
        })
      )
      .subscribe();

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadPrivilegesPage())
      )
      .subscribe();

    this.paginator.page.pipe(tap(() => this.loadPrivilegesPage())).subscribe();

  }

  loadPrivilegesPage() {
    this.dataSource.loadPrivileges(
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }

  onItemAdded($event: string, id: any) {
    const planets: Object = {
      mercury: { name: "Mercury", position: 1 },
      venus: { name: "Venus", position: 2 },
      earth: { name: "Earth", position: 3 },
    };
    const planetsArr: Array<Object> = Object.keys(planets).map(
      (key: string): string => planets[key]
    );
    console.log("planetsArr", planetsArr);
  }

  onItemRemoved($event: string , id: any) {

  }

  updateActionsForPrivilege($event: ActionEventArgs, privilege: Privilege)
  {
    console.log("about to update actions " + $event.value + " for privilege " + privilege.id);
    var tmp:any;
    tmp = $event.value;

    console.log(tmp.length);
    console.log(Array.isArray(tmp));
    privilege.actions = tmp;

    console.log(privilege);

    this.apiService.updatePrivilege(privilege.id,privilege).subscribe(data => {
      console.log(data);
      this.refresh();
    })
  }

  refresh() {
    this.loadPrivilegesPage();
    this.changeDetectorRefs.detectChanges();
  }

  updateDomain(e: ActionEventArgs, privilege: Privilege) {
    console.log("about to update the domain " + e.value + " for privilege " + privilege.id);
    privilege.domain = e.value;

    this.apiService.updatePrivilege(privilege.id,privilege).subscribe(data => {
      console.log(data);
      this.refresh();
    })

  }

  updateName(e: ActionEventArgs, privilege: Privilege) {
    console.log("about to update the name " + e.value + " for privilege " + privilege.id);
    privilege.name = e.value;

    this.apiService.updatePrivilege(privilege.id,privilege).subscribe(data => {
      console.log(data);
      this.refresh();
    })
  }

  updateDescription(e: ActionEventArgs, privilege: Privilege) {
    console.log("about to update the description " + e.value + " for privilege " + privilege.id);
    privilege.description = e.value;

    this.apiService.updatePrivilege(privilege.id,privilege).subscribe(data => {
      console.log(data);
      this.refresh();
    })
  }

  updateType(e: ActionEventArgs, privilege: Privilege) {
    console.log("about to update the type " + e.value + " for privilege " + privilege.id);
    privilege.type = e.value;

    this.apiService.updatePrivilege(privilege.id,privilege).subscribe(data => {
      console.log(data);
      this.refresh();
    })
  }

  updatePermission(e: ActionEventArgs, privilege: Privilege) {
    console.log("about to update the permission " + e.value + " for privilege " + privilege.id);
    privilege.permission = e.value;

    this.apiService.updatePrivilege(privilege.id,privilege).subscribe(data => {
      console.log(data);
      this.refresh();
    })
  }

  delete(id: number) {
    this.apiService.deletePrivilege(id).subscribe(data => {
      this.refresh();
    })
  }
}
