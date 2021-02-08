


import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {catchError, finalize} from "rxjs/operators";
import {ApiService} from "./api.service";
import {Configuration, ConfigurationItem} from "../model/configuration.model";
import {BehaviorSubject, Observable, of} from "rxjs";



export class ConfigurationItemsDatasource implements DataSource<ConfigurationItem> {
  numberOfConfigItems: number;

  private configurationsSubject = new BehaviorSubject<ConfigurationItem[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private apiService: ApiService) {

  }

  loadConfigurations(applicationId:string,
                     configurationVersionId:string,
                     filter:string,
                     sortDirection:string,
                     pageIndex:number,
                     pageSize:number) {

    this.loadingSubject.next(true);

    this.apiService.findConfigurationItems(applicationId, configurationVersionId,filter, sortDirection,pageIndex, pageSize)
      .pipe(
      catchError(err => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(
        //configurations => this.configurationsSubject.next(configurations.data),
        result => {
          this.configurationsSubject.next(result['data']);
          this.numberOfConfigItems = result['configCount'];
        }
      );
  }

  connect(collectionViewer: CollectionViewer): Observable<ConfigurationItem[]> {
    console.log("Connecting data source");
    return this.configurationsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.configurationsSubject.complete();
    this.loadingSubject.complete();
  }

}

