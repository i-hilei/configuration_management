import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../core/api.service";
import {AuthenticationService} from "../../services/authentication.service";
import {AlertService} from "../../services/alert.service";
import {User} from "../../model/user.model";
import {UsersDatasource} from "../../core/user.datasource";
import {fromEvent, merge} from "rxjs";
import {debounceTime, distinctUntilChanged, tap} from "rxjs/operators";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

import { DataManager, WebApiAdaptor,WebMethodAdaptor } from '@syncfusion/ej2-data';
import { EditSettingsModel,ToolbarItems } from '@syncfusion/ej2-angular-grids';

import {ActionEventArgs} from "@syncfusion/ej2-angular-inplace-editor";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {

  public data: DataManager;
  public editSettings: EditSettingsModel;
  public toolbar: ToolbarItems[];

  public fields: object = { text: 'value' };

  statusOptions =[
    {key: 'ACTIVE', value: 'ACTIVE'},
    {key: 'DECOMISSIONED', value: 'DECOMISSIONED'},
    {key: 'LOCKED', value: 'LOCKED'},
    {key: 'PASSIVE', value: 'PASSIVE'},
    {key: 'TOBEREVIEWEDAFTERIMPORT', value: 'TOBEREVIEWEDAFTERIMPORT'}
  ];
  public statusModel: object = { dataSource: this.statusOptions, fields: this.fields, placeholder: 'Select an option'};

  booleanOptions =[
    {key: true, value: 'True'},
    {key: false, value: 'False'}
  ];
  public booleanModel: object = { dataSource: this.booleanOptions, fields: this.fields, placeholder: 'Select an option'};

  users : User[];

  dataSource: UsersDatasource;

  displayedColumns = ['fullname','userid','status','isTechnical','tags','groups','applications'];

  isDisabled = true;

  configCount = 100;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  @ViewChild('input', {static: false}) input: ElementRef;

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
/*
    this.data = new DataManager({
      url: 'http://localhost:9083/api/authorization/persons?filter=a&sortOrder=ACS&pageNumber=0&pageSize=100',
      adaptor: new WebApiAdaptor(),
      headers: [{ Authorization: 'Bearer ' + this.authenticationService.currentUserValue.token }]
    });
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true };
    this.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];

    this.dataSource = new UsersDatasource(this.apiService);
    this.dataSource.loadUsers( '','asc', 0, 20);
    */

  }

  ngAfterViewInit() {
/*
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;

          this.loadUsersPage();
        })
      )
      .subscribe();

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadUsersPage())
      )
      .subscribe();

    this.paginator.page.pipe(tap(() => this.loadUsersPage())).subscribe();

  }

  loadUsersPage() {
    this.dataSource.loadUsers(
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }

  onItemAdded($event: string, id: any) {

  }

  onItemRemoved($event: string , id: any) {

  }

  sampleClick() {

  }

  save(e: ActionEventArgs, user: User) {
    console.log(e)

    console.log(user)

    console.log(" updating user " +  user.id + "with " + e.value);
*/
  }
}
