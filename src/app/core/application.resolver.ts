import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Application} from "../model/application.model";
import {ApiService} from "./api.service";


@Injectable()
export class ApplicationResolver implements Resolve<Application> {

  constructor(private apiService:ApiService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Application> {
    return this.apiService.findApplicationById(route.params['applicationid']);
  }

}

