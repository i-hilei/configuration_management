import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {catchError, finalize} from "rxjs/operators";
import {ApiService} from "./api.service";
import {BehaviorSubject, Observable, of} from "rxjs";
import {User} from "../model/user.model";

export class UsersDatasource implements DataSource<User> {
  numberOfUsers: number;

  private usersSubject = new BehaviorSubject<User[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private apiService: ApiService) {

  }

  loadUsers(         filter:string,
                     sortDirection:string,
                     pageIndex:number,
                     pageSize:number) {

    this.loadingSubject.next(true);


    this.apiService.findUsers(filter, sortDirection,pageIndex, pageSize)
      .pipe(
      catchError(err => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(
        result => {
          console.log(result);
          result['result'].forEach(ele => {
            ele.groupIds = ele.groups.map(a => a.id);
          });
          this.usersSubject.next(result['result']);
          this.numberOfUsers = result['count'];
        }
      );
  }

  connect(collectionViewer: CollectionViewer): Observable<User[]> {
    console.log("Connecting data source");
    return this.usersSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.usersSubject.complete();
    this.loadingSubject.complete();
  }

}
