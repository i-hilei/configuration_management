import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {ApiService} from "./api.service";
import {Version} from "../model/configuration.model";


@Injectable()
export class VersionResolver implements Resolve<Version> {

  constructor(private apiService:ApiService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Version> {
    return this.apiService.getApplicationVersion(route.params['versionid']);
  }


}

