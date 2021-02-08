import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {catchError, finalize} from "rxjs/operators";
import {ApiService} from "./api.service";
import {BehaviorSubject, Observable, of} from "rxjs";
import {Privilege} from "../model/group.model";

export class PrivilegesDatasource implements DataSource<Privilege> {
  numberOfPrivileges: number;

  private privilegesSubject = new BehaviorSubject<Privilege[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private apiService: ApiService) {

  }

  loadPrivileges(         filter:string,
                     sortDirection:string,
                     pageIndex:number,
                     pageSize:number) {

    this.loadingSubject.next(true);

    this.apiService.findPrivileges(filter, sortDirection,pageIndex, pageSize)
      .pipe(
      catchError(err => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(
        result => {
          console.log(result);
          this.privilegesSubject.next(result['data']);
          this.numberOfPrivileges = result['privilegeCount'];
        }
      );
  }

  connect(collectionViewer: CollectionViewer): Observable<Privilege[]> {
    console.log("Connecting data source");
    return this.privilegesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.privilegesSubject.complete();
    this.loadingSubject.complete();
  }

}
