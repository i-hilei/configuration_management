import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {ApiService} from "./api.service";
import {User} from "../model/user.model";

@Injectable()
export class UserResolver implements Resolve<User> {

  constructor(private apiService:ApiService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    return this.apiService.getUserById(route.params['userid']);
  }

}

