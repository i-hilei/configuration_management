import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {catchError, finalize} from "rxjs/operators";
import {ApiService} from "./api.service";
import {BehaviorSubject, Observable, of} from "rxjs";
import {InfrastructureComponent} from "../model/environment.model";

export class InfrastructureDatasource implements DataSource<InfrastructureComponent> {
  numberOfObjects: number;

  private infrastructureComponentSubject = new BehaviorSubject<InfrastructureComponent[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private apiService: ApiService) {

  }

  loadInfrastructure(filter:string,
                     sortDirection:string,
                     pageIndex:number,
                     pageSize:number,
                     environmentId:number) {

    this.loadingSubject.next(true);


    this.apiService.searchInfrastructure(filter, sortDirection,pageIndex, pageSize,environmentId)
      .pipe(
      catchError(err => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(
        result => {
          console.log(result);

          this.infrastructureComponentSubject.next(result['result']);
          this.numberOfObjects = result['count'];
        }
      );
  }

  connect(collectionViewer: CollectionViewer): Observable<InfrastructureComponent[]> {
    console.log("Connecting data source");
    return this.infrastructureComponentSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.infrastructureComponentSubject.complete();
    this.loadingSubject.complete();
  }

}
