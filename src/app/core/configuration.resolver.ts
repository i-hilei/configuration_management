


import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {ApiService} from "./api.service";
import {Configuration, Version} from "../model/configuration.model";


@Injectable()
export class ConfigurationResolver implements Resolve<Configuration> {

  constructor(private apiService:ApiService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Configuration> {
    return this.apiService.findConfigurationVersionById(route.params['configurationid']);
  }
  

}

