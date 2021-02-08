import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { User, UserResponse } from "../model/user.model";
import { Observable, of } from "rxjs/index";
import { ApiResponse } from "../model/api.response";
import { Application, Tag } from "../model/application.model";
import { catchError, map, tap } from "rxjs/operators";
import { Environment, InfrastructureResponse } from "../model/environment.model";
import {
  Configuration,
  ConfigurationItem,
  ConfigurationItemResponse,
  ConfigurationItemValue,
  Version
} from "../model/configuration.model";

import { ConfigService } from "./config.service";

import *  as  data from "../../assets/config/config.json";
import { License } from "../model/license.model";
import { Group, Privilege, PrivilegeResponse, Role, RoleResponse } from "../model/group.model";
import { ApplicationVersionInformation } from "../model/applicationversioninformation.model";
import { Report } from "../model/report.model";

@Injectable()
export class ApiService implements OnInit {

  baseUrl: string = '';


  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = data.baseUrl;
  }

  ngOnInit() {
    this.baseUrl = this.configService.getConfig().baseUrl;
    console.log("setting baseURL in ApiService to " + this.configService.getConfig().baseUrl);
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  login(loginPayload): Observable<ApiResponse> {
    console.log(loginPayload);
    return this.http.post<ApiResponse>(this.baseUrl + '/api/authorization/token/generate-token', loginPayload);
  }

  getReport(): Observable<HttpResponse<Report>> {
    return this.http.get<Report>(this.baseUrl + "/api/konfigure/report", { observe: 'response' }).pipe(tap(data => console.log("Report received: ", data)));
  }

  getUsers(): Observable<HttpResponse<User[]>> {
    return this.http.get<User[]>(this.baseUrl + "/api/authorization/persons", { observe: 'response' }).pipe(tap(data => console.log("User received: ", data)));

  }

  getUsersEligebleForEnvironment(environmentId: number): Observable<HttpResponse<User[]>> {
    return this.http.get<User[]>(this.baseUrl + `/api/authorization/persons/environment/${environmentId}`, { observe: 'response' });

  }

  findUsers(
    filter: string, sortOrder: string,
    pageNumber: number, pageSize: number): Observable<UserResponse> {


    return this.http.get<UserResponse>(this.baseUrl + `/api/authorization/persons/search`, {
      params: new HttpParams()
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    })
      .pipe(
        map(res => res),
        tap(data => console.log("Users received: ", data))
      );
  }

  getUserById(userId: number): Observable<User> {
    console.log("fetching user for id " + userId);
    return this.http.get<User>(this.baseUrl + `/api/authorization/persons/${userId}`, { observe: 'response' }).pipe(
      map(r => {
        let resp = r as HttpResponse<User>;
        console.log("returning resp " + resp.body.name);
        return resp.body;
      })
    );
  }

  getUserByUserName(userName: string): Observable<HttpResponse<User>> {
    console.log("fetching user for userName " + userName);
    return this.http.get<User>(this.baseUrl + `/api/authorization/persons/userName/${userName}`, { observe: 'response' }).pipe(tap(data => console.log("User received: ", data)));
    /*
    return this.http.get<User>(this.baseUrl + `/api/authorization/persons/userName/${userName}`,{observe: 'response'}).pipe(
      map(r => {
        let resp = r as HttpResponse<User>;
        return resp.body;
      }),
      tap(data => console.log("User received",data))
    );
    */

  }

  /*
  getApplications() : Observable<HttpResponse<Application[]>> {
    return this.http.get<Application[]>(this.baseUrl + "/api/konfigure/application",{observe: 'response'}).pipe(tap(data => console.log("Applications received: ",data)));
  }
*/

  createUser(user: User): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl + '/api/authorization/persons/', user);
  }

  updateUser(user: User): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.baseUrl + `/api/authorization/persons/${user.id}`, user);
  }

  updateStatusForUser(user: User, status: string): Observable<User> {
    return this.http.put<User>(this.baseUrl + `/api/authorization/persons/${user.id}/status/${status}`, { observe: 'response' }).pipe(tap(data => console.log("User received: ", data)));
  }

  patchUser(user: User, status: string = ''): Observable<HttpResponse<User>> {
    return this.http.patch<User>(this.baseUrl + `/api/authorization/persons/${user.id}`, user, { observe: 'response' }).pipe(tap(data => console.log("User received: ", data)));
  }

  deleteUser(userId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.baseUrl + `/api/authorization/persons/${userId}`);
  }

  findGroups(
    filter: string, sortOrder: string,
    pageNumber: number, pageSize: number): Observable<UserResponse> {


    return this.http.get<UserResponse>(this.baseUrl + `/api/authorization/groups`, {
      params: new HttpParams()
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    })
      .pipe(
        map(res => res),
        tap(data => console.log("Groups received: ", data))
      );
  }
  // createGroup(group: Group): Observable<ApiResponse> {
  //   return this.http.post<ApiResponse>(this.baseUrl + '/api/authorization/groups/', group);
  // }


  createGroup(group: Group): Observable<HttpResponse<Group>> {
    return this.http.post<Group>(this.baseUrl + '/api/authorization/groups/', group, { observe: 'response' }).pipe(
      tap(data => console.log("created privilege ", data))
    );
  }

  updateGroup(id: number, group: Group): Observable<HttpResponse<Group>> {
    return this.http.put<Group>(`${this.baseUrl}/api/authorization/groups/${id}`, group, { observe: 'response' }).pipe(
      tap(data => console.log("updated group ", data))
    );
  }

  deleteGroup(id: number) {
    return this.http.delete<ApiResponse>(this.baseUrl + `/api/authorization/groups/${id}`);
  }

  findRoles(
    filter: string, sortOrder: string,
    pageNumber: number, pageSize: number): Observable<RoleResponse> {


    return this.http.get<RoleResponse>(this.baseUrl + `/api/authorization/roles`, {
      params: new HttpParams()
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    })
      .pipe(
        map(res => res),
        tap(data => console.log("Roles received: ", data))
      );
  }

  createRole(role: Role): Observable<HttpResponse<Privilege>> {
    return this.http.post<Privilege>(this.baseUrl + '/api/authorization/roles/', role, { observe: 'response' }).pipe(
      tap(data => console.log("created privilege ", data))
    );
  }

  updateRole(id: number, role: Role): Observable<HttpResponse<Role>> {
    return this.http.put<Role>(`${this.baseUrl}/api/authorization/roles/${id}`, role, { observe: 'response' }).pipe(
      tap(data => console.log("updated role ", data))
    );
  }


  deleteRole(id: number): Observable<HttpResponse<Role>> {
    return this.http.delete<Role>(`${this.baseUrl}/api/authorization/roles/${id}`, { observe: 'response' }).pipe(
      tap(data => console.log("deleted role ", data))
    );
  }


  findPrivileges(
    filter: string, sortOrder: string,
    pageNumber: number, pageSize: number): Observable<PrivilegeResponse> {


    return this.http.get<PrivilegeResponse>(this.baseUrl + `/api/authorization/privileges`, {
      params: new HttpParams()
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    })
      .pipe(
        map(res => res),
        tap(data => console.log("Privileges received: ", data))
      );
  }

  createPrivilege(privilege: Privilege): Observable<HttpResponse<Privilege>> {
    return this.http.post<Privilege>(this.baseUrl + '/api/authorization/privileges/', privilege, { observe: 'response' }).pipe(
      tap(data => console.log("created privilege ", data))
    );
  }


  updatePrivilege(id: number, privilege: Privilege): Observable<HttpResponse<Privilege>> {
    return this.http.put<Privilege>(`${this.baseUrl}/api/authorization/privileges/${id}`, privilege, { observe: 'response' }).pipe(
      tap(data => console.log("updated privilege ", data))
    );
  }

  deletePrivilege(id: number): Observable<HttpResponse<Privilege>> {
    return this.http.delete<Privilege>(`${this.baseUrl}/api/authorization/privileges/${id}`, { observe: 'response' }).pipe(
      tap(data => console.log("deleted privilege ", data))
    );
  }

  findApplicationById(applicationId: number): Observable<Application> {
    return this.http.get<Application>(`${this.baseUrl}/api/konfigure/application/${applicationId}`);
  }

  getApplications(): Observable<HttpResponse<Application[]>> {
    return this.http.get<Application[]>(this.baseUrl + "/api/konfigure/application", { observe: 'response' }).pipe(tap(data => console.log("Applications received: ", data)));
  }

  searchForApplications(searchParam: string): Observable<HttpResponse<Application[]>> {

    return this.http.get<Application[]>(this.baseUrl + "/api/konfigure/application/search", {
      observe: 'response',
      params: new HttpParams()
        .set('searchParam', searchParam)
    }
    )
      .pipe(
        tap(data => console.log("Applications received"))
      );
  }

  getApplicationVersion(versionid: String): Observable<Version> {
    return this.http.get<Version>(`${this.baseUrl}/api/konfigure/version/${versionid}`);
  }

  updateApplication(id: number, application: Application): Observable<any> {
    const url = `${this.baseUrl}/api/scmdb/application/${id}`;
    return this.http.put(url, application, this.httpOptions).pipe(
      tap(_ => console.log(`updated application id=${id}`)),
      catchError(this.handleError<any>('updateProduct'))
    );
  }

  addTagToApplication(applicationId: number, tagId: number): Observable<Application> {
    console.log("about to add tag " + tagId + " to application " + applicationId);
    return this.http.put<Application>(`${this.baseUrl}/api/konfigure/application/${applicationId}/tag/${tagId}`, this.httpOptions);
  }

  updateStatusForApplication(applicationId: number, status: string): Observable<Application> {
    console.log("about to update status " + status + " to application " + applicationId);
    return this.http.put<Application>(`${this.baseUrl}/api/konfigure/application/${applicationId}/status/${status}`, this.httpOptions);
  }

  removeTagFromApplication(applicationId: number, tagId: number): Observable<Application> {
    console.log("about to remove tag " + tagId + " to application " + applicationId);
    return this.http.delete<Application>(`${this.baseUrl}/api/konfigure/application/${applicationId}/tag/${tagId}`, this.httpOptions);
  }

  findConfigurationVersionById(configurationversionid: number): Observable<Configuration> {
    return this.http.get<Configuration>(`${this.baseUrl}/api/konfigure/configuration/${configurationversionid}`);
  }

  getApplicationConfiguration(applicationid: String, configurationversionid: String): Observable<HttpResponse<Configuration[]>> {
    return this.http.get<Configuration[]>(this.baseUrl + "/api/konfigure/configurations", { observe: 'response' });
  }

  getEnvironments(): Observable<HttpResponse<Environment[]>> {
    return this.http.get<Environment[]>(this.baseUrl + "/api/konfigure/environments", { observe: 'response' }).pipe(tap(data => console.log("Environments received: ", data)));
  }

  getEnvironmentsForApplication(applicationid: String, configurationversionid: String): Observable<HttpResponse<Environment[]>> {

    return this.http.get<Environment[]>(this.baseUrl + "/api/konfigure/environments", { observe: 'response' });
  }

  findEnvironmentById(environmentId: number): Observable<Environment> {
    return this.http.get<Environment>(this.baseUrl + `/api/konfigure/environments/${environmentId}`);
  }


  searchForEnvironments(searchParam: string): Observable<HttpResponse<Environment[]>> {

    return this.http.get<Environment[]>(this.baseUrl + "/api/konfigure/environments/search", {
      observe: 'response',
      params: new HttpParams()
        .set('searchParam', searchParam)
    }
    )
      .pipe(
        tap(data => console.log("Environments received", data))
      );
  }

  searchInfrastructure(
    filter: string, sortOrder: string,
    pageNumber: number, pageSize: number, environmentId: number): Observable<InfrastructureResponse> {


    return this.http.get<InfrastructureResponse>(this.baseUrl + `/api/konfigure/hosts/searchWithFilter`, {
      params: new HttpParams()
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
        .set('environmentId', environmentId.toString())

    })
      .pipe(
        map(res => res),
        tap(data => console.log("Infrastructure received: ", data))
      );
  }

  addTagToEnvironment(environmentId: number, tagId: number): Observable<Environment> {
    console.log("about to add tag " + tagId + " to environment " + environmentId);
    return this.http.put<Environment>(this.baseUrl + `/api/konfigure/environments/${environmentId}/tag/${tagId}`, this.httpOptions);
  }

  updateStatusForEnvironment(environmentId: number, status: string): Observable<Environment> {
    console.log("about to update status " + status + " to environment " + environmentId);
    return this.http.put<Environment>(this.baseUrl + `/api/konfigure/environments/${environmentId}/status/${status}`, this.httpOptions);
  }

  updateOwnerForEnvironment(environmentId: number, ownerId: number): Observable<HttpResponse<Environment>> {
    console.log("about to update owner " + ownerId + " to environment " + environmentId);
    return this.http.put<Environment>(this.baseUrl + `/api/konfigure/environments/${environmentId}/owner/${ownerId}`, this.httpOptions, { observe: 'response' });
  }

  updateOwnerDelegateForEnvironment(environmentId: number, ownerDelegateId: number): Observable<HttpResponse<Environment>> {
    console.log("about to update owner " + ownerDelegateId + " to environment " + environmentId);
    return this.http.put<Environment>(this.baseUrl + `/api/konfigure/environments/${environmentId}/ownerdelegate/${ownerDelegateId}`, this.httpOptions, { observe: 'response' });
  }

  updateEnvironment(environmentId: number, environment: Environment): Observable<Environment> {
    console.log("about to update environment " + JSON.stringify(environment) + " to environment " + environmentId);

    return this.http.put<Environment>(this.baseUrl + `/api/konfigure/environments/${environmentId}`, environment, this.httpOptions);
  }

  removeTagFromEnvironment(environmentId: number, tagId: number): Observable<Environment> {
    console.log("about to remove tag " + tagId + " to environment " + environmentId);
    return this.http.delete<Environment>(this.baseUrl + `/api/konfigure/environments/${environmentId}/tag/${tagId}`, this.httpOptions);
  }

  findConfigurations(
    applicationId: number, configurationVersionId: number, filter = '', sortOrder = 'asc',
    pageNumber = 0, pageSize = 3): Observable<Configuration[]> {
    console.log('applicationID: ' + applicationId);

    return this.http.get<Configuration[]>(this.baseUrl + '/api/konfigure/configurations', {
      params: new HttpParams()
        .set('applicationId', applicationId.toString())
        .set('configurationVersionId', configurationVersionId.toString())
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    })
      .pipe(
        tap(data => console.log("Configuration received: ", data))

      );

  }

  findConfigurationItems(
    applicationId: string, configurationId: string, filter: string, sortOrder: string,
    pageNumber: number, pageSize: number): Observable<ConfigurationItemResponse> {
    console.log('applicationID: ' + applicationId);

    return this.http.get<ConfigurationItemResponse>(this.baseUrl + `/api/konfigure/configurationitem/configuration/${configurationId}`, {
      params: new HttpParams()
        .set('applicationId', applicationId)
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    })
      .pipe(
        map(res => res),
        tap(data => console.log("Configuration received: ", data))

      );
  }

  updateConfigurationItem(configurationversionid: number, configuration: any): Observable<Configuration> {

    const header = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
    // Hard coded object preparations
    configuration.configuration = { "id": configuration.configuration };
    // configuration.configurationitem = {"id": configuration.configurationitem};
    configuration.configurationItemValues.forEach(element => {
      element.configurationItem = { 'id': element.configurationItem }
    });
    return this.http.put<Configuration>(this.baseUrl + `/api/konfigure/configurationitem/${configurationversionid}`, configuration, { headers: header });
  }

  addTagToConfigurationItem(configurationItemId: number, tagId: number): Observable<ConfigurationItem> {
    console.log("about to add tag " + tagId + " to configurationItem " + configurationItemId);
    return this.http.put<ConfigurationItem>(this.baseUrl + `/api/konfigure/configurationitem/${configurationItemId}/tag/${tagId}`, this.httpOptions);
  }

  removeTagFromConfigurationItem(configurationItemId: number, tagId: number): Observable<ConfigurationItem> {
    console.log("about to remove tag " + tagId + " to configurationItem " + configurationItemId);
    return this.http.delete<ConfigurationItem>(this.baseUrl + `/api/konfigure/configurationitem/${configurationItemId}/tag/${tagId}`, this.httpOptions);
  }

  updateScopeForConfigurationItem(configurationItemId: number, scope: string): Observable<ConfigurationItem> {
    console.log("about to change scope " + scope + " of configurationItem " + configurationItemId);
    return this.http.put<ConfigurationItem>(this.baseUrl + `/api/konfigure/configurationitem/${configurationItemId}/scope/${scope}`, this.httpOptions);
  }

  updateValueForConfigurationItemValue(configurationItemValueId: number, map: string): Observable<ConfigurationItem> {
    console.log("about to change value " + map + " of configurationItemValue " + configurationItemValueId);

    return this.http.put<ConfigurationItem>(this.baseUrl + `/api/konfigure/configurationitemvalue/${configurationItemValueId}/value`, map, this.httpOptions);
  }

  approveConfigurationItemValue(configurationItemValueId: number): Observable<ConfigurationItem> {
    console.log("about to approve configurationItemValue " + configurationItemValueId);

    return this.http.put<ConfigurationItem>(this.baseUrl + `/api/konfigure/configurationitemvalue/${configurationItemValueId}/approve`, this.httpOptions)
      .pipe(
        tap(_ => console.log(`approved configurationItemValue with id=${configurationItemValueId}`)),
        catchError(this.handleError<any>('approveConfigurationItemValue'))
      );
  }

  getTags(): Observable<HttpResponse<Tag[]>> {
    return this.http.get<Tag[]>(this.baseUrl + `/api/konfigure/tag`, { observe: 'response' }).pipe(tap(data => console.log("Tags received: ", data)));
  }

  getTagByNameOrCreate(tagName: string): Observable<HttpResponse<Tag>> {
    console.log("getTagByNameOrCreate " + tagName);
    return this.http.get<Tag>(this.baseUrl + `/api/konfigure/tag/name/${tagName}`, { observe: 'response' }).pipe(tap(data => console.log("Tag received: ", data)));
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error("111111111" + error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  approveConfigurationForEnvironment(selectedEnvironmentToApprove: number, configurationId: number): Observable<ConfigurationItem> {
    console.log("about to approve configurationItemValue " + configurationId);

    return this.http.put<ConfigurationItem>(this.baseUrl + `/api/konfigure/configuration/${configurationId}/environment/${selectedEnvironmentToApprove}/approve`, this.httpOptions)
      .pipe(
        tap(_ => console.log(`approved configurationItemValue with id=${configurationId}`)),
        catchError(this.handleError<any>('approveConfigurationItemValue'))
      );
  }
  getLicense(): Observable<HttpResponse<License>> {
    return this.http.get<License>(this.baseUrl + "/api/konfigure/license", { observe: 'response' }).pipe(tap(data => console.log("License received: ", data)));
  }

  getApplicationImplementationVersion(): Observable<HttpResponse<ApplicationVersionInformation>> {
    return this.http.get<ApplicationVersionInformation>(this.baseUrl + "/api/konfigure/versioninformation", { observe: 'response' }).pipe(tap(data => console.log("applicationVersionInformation received: ", data)));
  }

}
