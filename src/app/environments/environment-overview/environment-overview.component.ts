import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../core/api.service";
import {AuthenticationService} from "../../services/authentication.service";
import {AlertService} from "../../services/alert.service";
import {Environment, Host, InfrastructureComponent} from "../../model/environment.model";

import {InfrastructureDatasource} from "../../core/infrastructure.datasource";
import {fromEvent, merge} from "rxjs";
import {debounceTime, distinctUntilChanged, tap} from "rxjs/operators";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ActionEventArgs} from "@syncfusion/ej2-angular-inplace-editor";

@Component({
  selector: 'app-environment-overview',
  templateUrl: './environment-overview.component.html',
  styleUrls: ['./environment-overview.component.scss']
})
export class EnvironmentOverviewComponent implements OnInit , AfterViewInit{
  environment: Environment;

  dataSource: InfrastructureDatasource;

  displayedColumns = ['name','fqdn','type','status','usage','tags','applications'];

  statusOptions =[
    {key: 'ACTIVE', value: 'ACTIVE'},
    {key: 'DECOMISSIONED', value: 'DECOMISSIONED'},
    {key: 'LOCKED', value: 'LOCKED'},
    {key: 'PASSIVE', value: 'PASSIVE'},
    {key: 'TOBEREVIEWEDAFTERIMPORT', value: 'TOBEREVIEWEDAFTERIMPORT'}
  ];
  public fields: object = { text: 'value' };

  public statusModel: object = { dataSource: this.statusOptions, fields: this.fields, placeholder: 'Select an option'};


  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  @ViewChild('input', {static: false}) input: ElementRef;

  constructor(private snackBar: MatSnackBar,
              private router: Router,
              private route: ActivatedRoute,
              private apiService: ApiService,
              private authenticationService: AuthenticationService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    if(!this.authenticationService.currentUserValue) {
      this.router.navigate(['login']);
      return;
    }
    this.environment = this.route.snapshot.data.environment;

    this.dataSource = new InfrastructureDatasource(this.apiService);
    this.dataSource.loadInfrastructure( '','asc', 0, 20,this.environment.id);

    /*
    for(var comp of this.environment.childs)
    {
      console.log((<Host>comp).function);
    }
     */
  }
  ngAfterViewInit() {

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;

          this.loadInfrastructurePage();
        })
      )
      .subscribe();

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadInfrastructurePage())
      )
      .subscribe();

    this.paginator.page.pipe(tap(() => this.loadInfrastructurePage())).subscribe();

  }

  loadInfrastructurePage() {
    this.dataSource.loadInfrastructure(
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.environment.id);
  }

  onItemAdded($event: string, id: any) {

  }

  onItemRemoved($event: string , id: any) {

  }

  save($event: ActionEventArgs, host: any) {

  }
}
