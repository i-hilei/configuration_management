import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {Config} from "../model/config";
import {ApiResponse} from "../model/api.response";
import {environment} from "../../environments/environment";

@Injectable()
export class ConfigService {
  private appConfig;

  constructor(private http: HttpClient) {}

  loadAppConfig() {
    return this.http.get('/assets/config/config.json')
      .toPromise()
      .then(data => {
        this.appConfig = data;
      });
  }

  getConfig() {
    return this.appConfig;
  }
}
