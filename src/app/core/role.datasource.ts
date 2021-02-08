import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {catchError, finalize} from "rxjs/operators";
import {ApiService} from "./api.service";
import {BehaviorSubject, Observable, of} from "rxjs";
import {Group, Role} from "../model/group.model";

export class RolesDatasource implements DataSource<Role> {
  numberOfRoles: number;

  private rolesSubject = new BehaviorSubject<Role[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private apiService: ApiService) {

  }

  loadRoles(         filter:string,
                     sortDirection:string,
                     pageIndex:number,
                     pageSize:number) {

    this.loadingSubject.next(true);

    this.apiService.findRoles(filter, sortDirection,pageIndex, pageSize)
      .pipe(
      catchError(err => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(
        result => {
          console.log(result);
          result['data'].forEach(ele => {
            ele.privilegeIds = ele.privileges.map(a => a.id);
          });
          this.rolesSubject.next(result['data']);
          this.numberOfRoles = result['roleCount'];
        }
      );
  }

  connect(collectionViewer: CollectionViewer): Observable<Role[]> {
    console.log("Connecting data source");
    return this.rolesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.rolesSubject.complete();
    this.loadingSubject.complete();
  }

}
