import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../../core/api.service";
import { GroupsDatasource } from "../../../core/group.datasource";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { AuthenticationService } from "../../../services/authentication.service";
import { AlertService } from "../../../services/alert.service";
import { fromEvent, merge } from "rxjs";
import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { Group, Role } from 'src/app/model/group.model';
import { ActionEventArgs } from '@syncfusion/ej2-angular-inplace-editor';
import { isArray } from 'rxjs/internal/util/isArray';


@Component({
  selector: 'app-list-groups',
  templateUrl: './list-groups.component.html',
  styleUrls: ['./list-groups.component.scss']
})

export class ListGroupsComponent implements OnInit, AfterViewInit {

  dataSource: GroupsDatasource;

  displayedColumns = ['name', 'description', 'roles', 'commands'];

  isDisabled = true;

  configCount = 100;

  public roleList: Role[] = [];
  public fields: Object = { text: 'name', value: 'id' };
  public roleModel: object;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @ViewChild('input', { static: false }) input: ElementRef;

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

    this.apiService.findRoles('', 'asc', 0, 1000).subscribe(result => {
      this.roleList = result['data'];
      this.roleModel = { dataSource: this.roleList, fields: this.fields, placeholder: 'Select a role' };
    });

    this.dataSource = new GroupsDatasource(this.apiService);
    this.dataSource.loadGroups('', 'asc', 0, 20);
  }

  ngAfterViewInit() {

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;

          this.loadGroupsPage();
        })
      )
      .subscribe();

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadGroupsPage())
      )
      .subscribe();

    this.paginator.page.pipe(tap(() => this.loadGroupsPage())).subscribe();

  }

  loadGroupsPage() {
    this.dataSource.loadGroups(
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }

  refresh() {
    this.loadGroupsPage();
    this.changeDetectorRefs.detectChanges();
  }


  onItemAdded($event: string, id: any) {

  }

  onItemRemoved($event: string, id: any) {

  }

  delete(id: number) {
    this.apiService.deleteGroup(id).subscribe(data => {
      this.refresh();
    })
  }

  updateName(e: ActionEventArgs, group: Group) {
    console.log("about to update the name " + e.value + " for group " + group.id);
    group.name = e.value;

    this.apiService.updateGroup(group.id, group).subscribe(data => {
      console.log(data);
      this.refresh();
    })
  }

  updateDescription(e: ActionEventArgs, group: Group) {
    console.log("about to update the description " + e.value + " for group " + group.id);
    group.description = e.value;

    this.apiService.updateGroup(group.id, group).subscribe(data => {
      console.log(data);
      this.refresh();
    })
  }

  updaterole(e, group: Group) {
    console.log("about to update the roles " + e.value + " for role " + group.id);
    var tmp: any;
    tmp = e.value;
    if (isArray(tmp)) {
      let selectedRoles = [];
      tmp.forEach(ele => {
        if (this.roleList.find(f => f.id == ele))
          selectedRoles.push(this.roleList.find(f => f.id == ele))
      });
      console.log(selectedRoles);
      if (selectedRoles.length > 0) {
        group.roles = selectedRoles;
        this.apiService.updateGroup(group.id, group).subscribe(data => {
          console.log(data);
          this.refresh();
        })
      }
    }
  }

}
