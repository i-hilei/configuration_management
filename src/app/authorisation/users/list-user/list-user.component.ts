import { Component, OnInit, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../../../model/user.model";
import { ApiService } from "../../../core/api.service";
import { AuthenticationService } from "../../../services/authentication.service";
import { AlertService } from "../../../services/alert.service";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import { EditSettingsModel, ToolbarItems } from "@syncfusion/ej2-angular-grids";
import { UsersDatasource } from "../../../core/user.datasource";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fromEvent, merge } from "rxjs";
import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { ActionEventArgs } from "@syncfusion/ej2-angular-inplace-editor";
import { ChangeDetectorRef } from '@angular/core';
import { Group } from 'src/app/model/group.model';
import { isArray } from 'rxjs/internal/util/isArray';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit, AfterViewInit {

  public data: DataManager;
  public editSettings: EditSettingsModel;
  public toolbar: ToolbarItems[];

  public datamultiselect: string[] = ['Badminton', 'Cricket', 'Football', 'Golf', 'Tennis'];
  public placeholdermultiselect: string = 'Select a groups';

  public fields: object = { text: 'value' };
  public fields1: Object = { text: 'name', value: 'id' };

  statusOptions = [
    { key: 'ACTIVE', value: 'ACTIVE' },
    { key: 'DECOMISSIONED', value: 'DECOMISSIONED' },
    { key: 'LOCKED', value: 'LOCKED' },
    { key: 'PASSIVE', value: 'PASSIVE' },
    { key: 'TOBEREVIEWEDAFTERIMPORT', value: 'TOBEREVIEWEDAFTERIMPORT' }
  ];
  public statusModel: object = { dataSource: this.statusOptions, fields: this.fields, placeholder: 'Select a status' };

  booleanOptions = [
    { key: true, value: 'True' },
    { key: false, value: 'False' }
  ];
  public booleanModel: object = { dataSource: this.booleanOptions, fields: this.fields, placeholder: 'Select an option' };

  users: User[];

  dataSource: UsersDatasource;

  displayedColumns = ['preName', 'name', 'userid', 'status', 'isTechnical', 'tags', 'groups', 'applications', 'commands'];

  isDisabled = true;

  configCount = 100;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @ViewChild('input', { static: false }) input: ElementRef;
  GroupList: Group[] = [];
  public ListModel: object = { dataSource: this.GroupList, fields: this.fields1, placeholder: 'Select a group' };

  constructor(private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private changeDetectorRefs: ChangeDetectorRef) { }


  ngOnInit() {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['login']);
      return;
    }
    /*
        this.data = new DataManager({
          url: 'http://demeter.local:9083/api/authorization/persons?filter=a&sortOrder=ACS&pageNumber=0&pageSize=100',
          adaptor: new WebApiAdaptor(),
          headers: [{ Authorization: 'Bearer ' + this.authenticationService.currentUserValue.token }]
        });
        this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true };
        this.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
    */
    this.dataSource = new UsersDatasource(this.apiService);
    this.dataSource.loadUsers('', 'asc', 0, 20);
    /*
    this.route.paramMap.subscribe(params => {
      console.log(params.get('applicationid'));
      console.log(params.get('configurationid'));
      this.dataSource.loadUsers( '','asc', 0, 20);
    });
    */
    this.apiService.findGroups('', 'asc', 0, 1000).subscribe(result => {
      this.GroupList = result['data'];
      this.ListModel = { dataSource: this.GroupList, fields: this.fields1, placeholder: 'Select a group' };
    });

  }

  ngAfterViewInit() {

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

  onItemRemoved($event: string, id: any) {

  }

  sampleClick() {

  }

  save(e: ActionEventArgs, user: User) {
    console.log(" updating user " + user + " with " + e.value);
    this.apiService.updateStatusForUser(user, e.value).subscribe(data => {
      console.log(data);
    })
  }

  updateTechnical(e: ActionEventArgs, user: User) {
    console.log(" updating user " + user.id + " with " + e.value);
    user.technical = Boolean(e.value);

    this.apiService.patchUser(user, e.value).subscribe(data => {
      console.log(data);
    })
  }

  delete(id: number) {
    this.apiService.deleteUser(id).subscribe(data => {
      this.refresh();
    })
  }

  refresh() {
    this.loadUsersPage();
    this.changeDetectorRefs.detectChanges();
  }

  updateUser(e, user: User, field: string) {
    console.log(" updating user " + field + " with " + e.value);
    user[field] = (e.value);

    this.apiService.patchUser(user, e.value).subscribe(data => {
      console.log(data);
    })
  }
  updateUserGrops($event, user: User) {
    console.log("about to update the privileges " + $event.value + " for user " + user.id);
    var tmp: any;
    tmp = $event.value;
    // if (this.GroupList.find(f => f.id == tmp))
    //   user.groups = this.GroupList.filter(f => f.id == tmp);

    if (isArray(tmp)) {
      let selectedGroups = [];
      tmp.forEach(ele => {
        if (this.GroupList.find(f => f.id == ele))
          selectedGroups.push(this.GroupList.find(f => f.id == ele))
      });
      console.log(selectedGroups);
      if (selectedGroups.length > 0) {
        user.groups = selectedGroups;
        this.apiService.patchUser(user).subscribe(data => {
          console.log(data);
          this.refresh();
        })
      }
    }
  }


  getvalue(users) {
    if (users.length > 0)
      return users[0].name;
    else
      return '';
  }
}
