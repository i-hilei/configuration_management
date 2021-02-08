import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { RolesDatasource } from "../../../core/role.datasource";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../core/api.service";
import { AuthenticationService } from "../../../services/authentication.service";
import { AlertService } from "../../../services/alert.service";
import { fromEvent, merge } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, finalize, tap } from "rxjs/operators";
import { Privilege, Role } from "../../../model/group.model";
import { ActionEventArgs } from "@syncfusion/ej2-angular-inplace-editor";
import { MultiSelectChangeEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { of } from 'rxjs';
import { isArray } from 'rxjs/internal/util/isArray';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent implements OnInit, AfterViewInit {

  dataSource: RolesDatasource;

  displayedColumns = ['name', 'description', 'privileges', 'commands'];

  isDisabled = true;

  configCount = 100;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @ViewChild('input', { static: false }) input: ElementRef;

  // set the placeholder to MultiSelect Dropdown input element
  public privilegesPlaceholder: string = 'Select a privilege';
  public box: string = 'Box';

  privilegeOptions = [
    { key: 'ALL', value: 'ALL' },
    { key: 'APPLICATION', value: 'APPLICATION' },
    { key: 'VERSION', value: 'VERSION' },
    { key: 'CONFIGURATION', value: 'CONFIGURATION' },
    { key: 'ENVIRONMENT', value: 'ENVIRONMENT' },
    { key: 'HOST', value: 'HOST' },
    { key: 'USER', value: 'USER' },
    { key: 'GROUP', value: 'GROUP' },
    { key: 'ROLE', value: 'ROLE' },
    { key: 'PERMISSION', value: 'PERMISSION' },
    { key: 'PRIVILEGE', value: 'PRIVILEGE' }
  ];

  public PrivilegeList: Privilege[] = [];
  public fields: Object = { text: 'name', value: 'id' };
  public privilegeModel: object;

  public dataActions: string[] = ['CREATE', 'READ', 'UPDATE', 'DELETE', 'READ_CONFIDENTIAL', 'APPROVE', 'APPROVE_CONFIDENTIAL', 'EXPORT', 'IMPORT'];
  // public menuItems: any[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private changeDetectorRefs: ChangeDetectorRef) {
    // this.menuItems = this.mapItems(router.config);
  }

  ngOnInit() {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['login']);
      return;
    }

    this.apiService.findPrivileges('', 'asc', 0, 1000).subscribe(result => {
      this.PrivilegeList = result['data'];
      this.privilegeModel = { dataSource: this.PrivilegeList, fields: this.fields, placeholder: 'Select a privilege' };
    });

    this.dataSource = new RolesDatasource(this.apiService);
    this.dataSource.loadRoles('', 'asc', 0, 20);
  }

  ngAfterViewInit() {

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;

          this.loadRolesPage();
        })
      )
      .subscribe();

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadRolesPage())
      )
      .subscribe();

    this.paginator.page.pipe(tap(() => this.loadRolesPage())).subscribe();

  }

  loadRolesPage() {
    this.dataSource.loadRoles(
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }

  refresh() {
    this.loadRolesPage();
    this.changeDetectorRefs.detectChanges();
  }


  onItemAdded($event: string, id: any) {

  }

  onItemRemoved($event: string, id: any) {

  }

  updateName(e: ActionEventArgs, role: Role) {
    console.log("about to update the name " + e.value + " for role " + role.id);
    role.name = e.value;

    this.apiService.updateRole(role.id, role).subscribe(data => {
      console.log(data);
      this.refresh();
    })
  }

  updateDescription(e: ActionEventArgs, role: Role) {
    console.log("about to update the description " + e.value + " for role " + role.id);
    role.description = e.value;

    this.apiService.updateRole(role.id, role).subscribe(data => {
      console.log(data);
      this.refresh();
    })
  }

  updatePrivilege($event: MultiSelectChangeEventArgs, role: Role) {
    console.log("about to update the privileges " + $event.value + " for role " + role.id);
    var tmp: any;
    tmp = $event.value;

    // if (this.PrivilegeList.find(f => f.id == tmp))
    //   role.privileges = this.PrivilegeList.filter(f => f.id == tmp);

    if (isArray(tmp)) {
      let selectedPrivileges = [];
      tmp.forEach(ele => {
        if (this.PrivilegeList.find(f => f.id == ele))
          selectedPrivileges.push(this.PrivilegeList.find(f => f.id == ele))
      });
      console.log(selectedPrivileges);
      if (selectedPrivileges.length > 0) {
        role.privileges = selectedPrivileges;
        this.apiService.updateRole(role.id, role).subscribe(data => {
          console.log(data);
          this.refresh();
        })
      }
    }
  }

  getvalue(pr: Privilege[]) {
    let value = [];
    pr.forEach(f => {
      value.push(f.id);
    })
    return value;
  }

  delete(id: number) {
    this.apiService.deleteRole(id).subscribe(data => {
      this.refresh();
    })
  }

}
