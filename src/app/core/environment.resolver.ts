import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {ApiService} from "./api.service";
import {Environment} from "../model/environment.model";


@Injectable()
export class EnvironmentResolver implements Resolve<Environment> {

  constructor(private apiService:ApiService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Environment> {
    return this.apiService.findEnvironmentById(route.params['environmentid']);
  }

}

