import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { catchError, finalize } from "rxjs/operators";
import { ApiService } from "./api.service";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Group, Role } from "../model/group.model";

export class GroupsDatasource implements DataSource<Group> {
  numberOfGroups: number;

  private groupsSubject = new BehaviorSubject<Group[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private apiService: ApiService) {

  }

  loadGroups(filter: string,
    sortDirection: string,
    pageIndex: number,
    pageSize: number) {

    this.loadingSubject.next(true);

    this.apiService.findGroups(filter, sortDirection, pageIndex, pageSize)
      .pipe(
        catchError(err => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(
        result => {
          console.log(result);
          result['data'].forEach(ele => {
            ele.roleIds = ele.roles.map(a => a.id);
          });
          this.groupsSubject.next(result['data']);
          this.numberOfGroups = result['groupCount'];
        }
      );
  }

  connect(collectionViewer: CollectionViewer): Observable<Group[]> {
    console.log("Connecting data source");
    return this.groupsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.groupsSubject.complete();
    this.loadingSubject.complete();
  }

}
