import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {AddUserComponent} from './authorisation/users/add-user/add-user.component';
import {EditUserComponent} from './authorisation/users/edit-user/edit-user.component';
import {ListUserComponent} from './authorisation/users/list-user/list-user.component';
import {ApiService} from './core/api.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JwtInterceptor} from './core/interceptor';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {ApplicationsComponent} from './applications/applications.component';
import {ApplicationCardsComponent} from './applications/application-cards/application-cards.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TagInputModule} from 'ngx-chips';

import {ApplicationResolver} from './core/application.resolver';
import {AppRoutingModule} from './app.routing';
import {ConfigurationResolver} from './core/configuration.resolver';
import {VersionResolver} from './core/version.resolver';
import {ApplicationEditComponent} from './applications/application-edit/application-edit.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {ConfigService} from './core/config.service';
import {ErrorInterceptor} from './core/error.interceptor';
import {AlertComponent} from './alert/alert.component';
import {MatSelectModule} from '@angular/material/select';
import {UsersComponent} from './authorisation/users/users.component';
import {EnvironmentsComponent} from './environments/environments.component';
import {EnvironmentsListComponent} from './environments/environments-list/environments-list.component';
import {UserProfileComponent} from './authorisation/users/user-profile/user-profile.component';
import {GroupsComponent} from './authorisation/groups/groups.component';
import {ListGroupsComponent} from './authorisation/groups/list-groups/list-groups.component';
import {AddGroupComponent} from './authorisation/groups/add-group/add-group.component';
import {EditGroupComponent} from './authorisation/groups/edit-group/edit-group.component';
import {RolesComponent} from './authorisation/roles/roles.component';
import {ListRolesComponent} from './authorisation/roles/list-roles/list-roles.component';
import {EnvironmentCardsComponent} from './environments/environment-cards/environment-cards.component';
import {ListPrivilegesComponent} from './authorisation/privileges/list-privileges/list-privileges.component';
import {PrivilegesComponent} from './authorisation/privileges/privileges.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';

import {InPlaceEditorAllModule} from '@syncfusion/ej2-angular-inplace-editor';
import {GridModule} from '@syncfusion/ej2-angular-grids';
import {PipelinesComponent} from './pipelines/pipelines.component';
import {PipelineCardsComponent} from './pipelines/pipeline-cards/pipeline-cards.component';
import {EnvironmentCardComponent} from './environments/environment-cards/environment-card/environment-card.component';
import {EnvironmentOverviewComponent} from './environments/environment-overview/environment-overview.component';
import {EnvironmentResolver} from './core/environment.resolver';
import {UserResolver} from './core/user.resolver';
import {MyProfileComponent} from './authorisation/users/my-profile/my-profile.component';
import {ComboBoxModule, MultiSelectModule} from '@syncfusion/ej2-angular-dropdowns';
import {BasicInputFieldComponent} from './shared/components/form-input/basic-input-field/basic-input-field.component';
import { HostsComponent } from './hosts/hosts.component';
import { HostCardsComponent } from './hosts/host-cards/host-cards.component';
import { HostCardComponent } from './hosts/host-cards/host-card/host-card.component';
import { PrivilegeCreateComponent } from './authorisation/privileges/privilege-create/privilege-create.component';
import { RoleCreateComponent } from './authorisation/roles/role-create/role-create.component';

import { MzdTimelineModule } from 'ngx-rend-timeline';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {ApplicationOverviewComponent} from "./applications/applications-overview/application-overview.component";
import {Applicationconfigurationmodal} from "./applications/applicationconfiguration/applicationconfigurationmodal/applicationconfigurationmodal.component";
import {ApplicationconfigurationComponent} from "./applications/applicationconfiguration/applicationconfiguration.component";
import { LicenseValidateComponent } from './licenseValidate/licenseValidate.component';

const appInitializerFn = (appConfig: ConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};

@NgModule({
  declarations: [
    AppComponent,
    BasicInputFieldComponent,
    LoginComponent,
    ChangePasswordComponent,
    LicenseValidateComponent,
    AddUserComponent,
    EditUserComponent,
    ListUserComponent,
    HomeComponent,
    AboutComponent,
    ApplicationsComponent,
    ApplicationCardsComponent,
    ApplicationconfigurationComponent,
    Applicationconfigurationmodal,
    ApplicationEditComponent,
    ApplicationOverviewComponent,
    AlertComponent,
    UsersComponent,
    EnvironmentsComponent,
    EnvironmentsListComponent,
    UserProfileComponent,
    GroupsComponent,
    ListGroupsComponent,
    AddGroupComponent,
    EditGroupComponent,
    RolesComponent,
    ListRolesComponent,
    EnvironmentCardsComponent,
    ListPrivilegesComponent,
    PrivilegesComponent,
    PipelinesComponent,
    PipelineCardsComponent,
    EnvironmentCardComponent,
    EnvironmentOverviewComponent,
    MyProfileComponent,
    HostsComponent,
    HostCardsComponent,
    HostCardComponent,
    PrivilegeCreateComponent,
    RoleCreateComponent,


  ],
    imports: [
        BrowserModule,
        TagInputModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
        MatMenuModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        MatFormFieldModule,
        MatGridListModule,
        MatInputModule,
        MatTableModule,
        MatListModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        AppRoutingModule,
        MatChipsModule,
        FormsModule,
        MatDialogModule,
        MatSnackBarModule,
        MatExpansionModule,
        MatSelectModule,
        MatTabsModule,
        // Registering EJ2 In-place Editor Module
        InPlaceEditorAllModule,
        GridModule,
        MultiSelectModule,
        ComboBoxModule,
      MzdTimelineModule,
      FontAwesomeModule
    ],
  exports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    MatTableModule,
    MatListModule,
    MatSnackBarModule
  ],
  providers: [

    ApiService,
    {
      provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor,
      multi: true
    },
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    ApplicationResolver,
    VersionResolver,
    ConfigurationResolver,
    EnvironmentResolver,
    UserResolver,
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [ConfigService]
    }
  ],

  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  entryComponents: [
    Applicationconfigurationmodal
  ],
})
export class AppModule {
}
