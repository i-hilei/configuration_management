import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AddUserComponent } from './authorisation/users/add-user/add-user.component';
import { ListUserComponent } from './authorisation/users/list-user/list-user.component';
import { EditUserComponent } from './authorisation/users/edit-user/edit-user.component';
import { ApplicationsComponent } from './applications/applications.component';
import { ApplicationCardsComponent } from './applications/application-cards/application-cards.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { ApplicationResolver } from './core/application.resolver';
import { NgModule } from '@angular/core';
import { VersionResolver } from './core/version.resolver';
import { ConfigurationResolver } from './core/configuration.resolver';
import { ApplicationEditComponent } from './applications/application-edit/application-edit.component';

import { AuthGuard } from './core/auth.guard';
import { UsersComponent } from './authorisation/users/users.component';
import { EnvironmentsComponent } from './environments/environments.component';
import { UserProfileComponent } from './authorisation/users/user-profile/user-profile.component';
import { UserResolver } from './core/user.resolver';
import { GroupsComponent } from './authorisation/groups/groups.component';
import { AddGroupComponent } from './authorisation/groups/add-group/add-group.component';
import { EditGroupComponent } from './authorisation/groups/edit-group/edit-group.component';
import { ListGroupsComponent } from './authorisation/groups/list-groups/list-groups.component';
import { RolesComponent } from './authorisation/roles/roles.component';
import { ListRolesComponent } from './authorisation/roles/list-roles/list-roles.component';
import { EnvironmentCardsComponent } from './environments/environment-cards/environment-cards.component';
import { PrivilegesComponent } from './authorisation/privileges/privileges.component';
import { ListPrivilegesComponent } from './authorisation/privileges/list-privileges/list-privileges.component';
import { PipelinesComponent } from './pipelines/pipelines.component';
import { PipelineCardsComponent } from './pipelines/pipeline-cards/pipeline-cards.component';
import { EnvironmentOverviewComponent } from './environments/environment-overview/environment-overview.component';
import { EnvironmentResolver } from './core/environment.resolver';
import { MyProfileComponent } from './authorisation/users/my-profile/my-profile.component';
import { PrivilegeCreateComponent } from "./authorisation/privileges/privilege-create/privilege-create.component";
import { RoleCreateComponent } from "./authorisation/roles/role-create/role-create.component";
import { ApplicationOverviewComponent } from "./applications/applications-overview/application-overview.component";
import { ApplicationconfigurationComponent } from "./applications/applicationconfiguration/applicationconfiguration.component";
import { LicenseValidateComponent } from './licenseValidate/licenseValidate.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'license-validate', component: LicenseValidateComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent },
  {
    path: 'applications', component: ApplicationsComponent, canActivate: [AuthGuard], children: [
      {
        path: '',
        component: ApplicationCardsComponent
      },
      {
        path: ':applicationid', component: ApplicationOverviewComponent, children: [
          {
            path: 'configuration/:applicationid/:versionid/:configurationid',
            component: ApplicationconfigurationComponent,
            outlet: 'right',
            resolve:
            {
              application: ApplicationResolver,
              version: VersionResolver,
              configuration: ConfigurationResolver
            }
          }
        ],
        resolve:
        {
          application: ApplicationResolver
        }
      },
      // {
      //   path: ':applicationid/configuration/:versionid/:configurationid',
      //   component: ApplicationconfigurationComponent, canActivate: [AuthGuard],
      //   resolve:
      //   {
      //     application: ApplicationResolver,
      //     version: VersionResolver,
      //     configuration: ConfigurationResolver
      //   }
      // },

    ]
  },
  { path: 'application-edit/:applicationid', component: ApplicationEditComponent },
  {
    path: 'users', component: UsersComponent, canActivate: [AuthGuard], children: [
      { path: 'add-user', component: AddUserComponent },
      { path: 'edit-user', component: EditUserComponent },
      {
        path: 'my-profile', component: MyProfileComponent, canActivate: [AuthGuard],
        children: [{
          path: 'change-password', component: ChangePasswordComponent,
          outlet: 'right'
        }]
      },
      {
        path: 'profile/:userid',
        component: UserProfileComponent, canActivate: [AuthGuard],
        resolve:
        {
          user: UserResolver
        }
      },
      { path: '', component: ListUserComponent }

    ]
  },
  {
    path: 'groups', component: GroupsComponent, canActivate: [AuthGuard], children: [
      { path: '', component: ListGroupsComponent },
      { path: 'create', component: AddGroupComponent },
      { path: 'edit-group', component: EditGroupComponent }
    ]
  },
  {
    path: 'roles', component: RolesComponent, canActivate: [AuthGuard], children: [
      { path: '', component: ListRolesComponent },
      { path: 'create', component: RoleCreateComponent }
    ]
  },
  {
    path: 'privileges', component: PrivilegesComponent, canActivate: [AuthGuard], children: [
      { path: '', component: ListPrivilegesComponent },
      { path: 'create', component: PrivilegeCreateComponent }
    ]
  },
  {
    path: 'environments', component: EnvironmentsComponent, canActivate: [AuthGuard], children: [
      { path: '', component: EnvironmentCardsComponent },
      {
        path: 'environment-overview/:environmentid',
        component: EnvironmentOverviewComponent, canActivate: [AuthGuard],
        resolve:
        {
          environment: EnvironmentResolver
        }
      }
    ]
  },
  {
    path: 'pipelines', component: PipelinesComponent, canActivate: [AuthGuard], children: [
      {
        path: '', component: PipelineCardsComponent
      }
    ]
  },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

// export const routing = RouterModule.forRoot(routes);
