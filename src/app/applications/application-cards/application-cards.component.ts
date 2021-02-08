import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Application, EnvType, Status, Tag } from '../../model/application.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { finalize } from 'rxjs/operators';
import { element } from 'protractor';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { AlertService } from '../../services/alert.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActionEventArgs } from '@syncfusion/ej2-angular-inplace-editor';
import { orderBy } from 'lodash';

@Component({
  selector: 'app-application-cards',
  templateUrl: './application-cards.component.html',
  styleUrls: ['./application-cards.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ApplicationCardsComponent implements OnInit {


  constructor(private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
  ) {
  }

  get statuses(): string[] {
    return Object.keys(Status);
  }


  get image(): string {
    return this.application.image || 'https://dummyimage.com/200x200/e6e6e6/575757.png&text=No+image';
  }
  @Input() application: Application;
  @Input() editMode: boolean;
  @Output() madedChages = new EventEmitter();

  applications: Application[];
  tag: Tag;
  editableText = 'LuLa';
  envTypes: EnvType[] = [];
  public form: FormGroup;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  loading = false;
  public options = [
    { key: 'ACTIVE', value: 'ACTIVE' },
    { key: 'DECOMISSIONED', value: 'DECOMISSIONED' },
    { key: 'LOCKED', value: 'LOCKED' },
    { key: 'PASSIVE', value: 'PASSIVE' },
    { key: 'TOBEREVIEWEDAFTERIMPORT', value: 'TOBEREVIEWEDAFTERIMPORT' }
  ];

  public fields: object = { text: 'value' };
  public model: object = { dataSource: this.options, fields: this.fields, placeholder: 'Select an option' };

  /*
   save(data: Application, id: number): void {
     data.image = this.image;
     data.tags = this.application.tags;
     data.version = this.application.version;
     this.apiService
       .updateApplication(id,data)
       .pipe(finalize(() => this.switchMode()))
       .subscribe(res => {
         this.madedChages.emit();
         this.snackBar.open('Changes saved', null, {
           duration: 3000
         });
       });
   }
 */
  searchword: any;
  // orderBy = orderBy;

  navigate(path) {
    this.router.navigate([{ outlets: { primary: path, sidemenu: path } }], { relativeTo: this.route });
  }

  dynamicSort(e) {
    console.log(e);

    this.applications = orderBy(this.applications, 'id');
    // this.applications = orderBy(this.applications, e.value);
    if (e.value == 'identifier') {
      this.applications = this.transform(this.applications, 'displayName');
    }
    this.applications = this.transform(this.applications, e.value);
  }

  transform(value: any[], propertyName: string, sortDesc = false): any[] {
    if (propertyName)
      if (sortDesc)
        return value.sort((a: any, b: any) => b[propertyName].localeCompare(a[propertyName]));
      else
        return value.sort((b: any, a: any) => b[propertyName].localeCompare(a[propertyName]));
    else
      return value;
  }

  ngOnInit() {
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['login']);
      return;
    }
    this.loading = true;
    this.apiService.getApplications()
      .subscribe(data => {
        // this.applications = data;
        console.log('status :' + data.status);
        console.log('status :' + data.statusText);
        this.applications = data.body;

        for (const app of this.applications) {
          const map = new Map<string, EnvType>();
          for (const env of app.environments) {
            let envType: EnvType;
            if (map.has(env.type)) {
              envType = map.get(env.type);
            } else {
              envType = new EnvType();
            }
            envType.name = env.type;
            envType.environments.push(env);
            map.set(env.type, envType);
          }
          const finalTypes: EnvType[] = [];
          map.forEach((value: EnvType, key: string) => {
            finalTypes.push(value);
          });
          app.envTypes = finalTypes;
        }
      },
        error => {

          this.alertService.error(error);
          this.loading = false;
        });
    this.form = this.buildForm();
    this.patchForm(this.application);
  }


  buildForm(): FormGroup {
    return this.formBuilder.group({
      //      name: [{ value: '', disabled: true }, [Validators.required]],
      //      identifier: [{ value: '', disabled: true }, [Validators.required]],
      //      status: [{ value: '', disabled: true }, [Validators.required]]
    });
  }

  patchForm(application: Application): void {
    this.form.patchValue({
      //      name: application.name,
      //      identifier: application.identifier,
      //      status: application.status
    });
  }

  switchMode(): void {
    this.editMode ? this.form.disable() : this.form.enable();
    this.editMode = !this.editMode;
  }

  public saveStatus(id: number, $event: any): void {
    console.log('saveStatus ' + $event);
  }


  onItemAdded($event: Tag, id: number) {
    console.log($event);

    this.apiService.getTagByNameOrCreate($event.tag)
      .subscribe(data => {
        // this.applications = data;
        console.log('status: ' + data.status);
        console.log('data: ' + data.body.tag);
        this.tag = data.body;

        this.apiService.addTagToApplication(id, this.tag.id)
          .subscribe(data => {
            console.log(data);
          });
      });
  }

  onItemRemoved($event: Tag, id: number) {
    console.log('removing tag with id ' + $event.id);
    this.apiService.removeTagFromApplication(id, $event.id).subscribe(data => {
      console.log(data);
    });
  }

  save($event: any, applicationId: number) {
    console.log('Changing status to ' + $event + ' for application ' + applicationId);
    this.apiService.updateStatusForApplication(applicationId, $event).subscribe(data => {
      console.log(data);
    });
  }

  public actionSuccess(e: ActionEventArgs, applicationId: number): void {
    console.log('Changing status to ' + e.value + ' for application ' + applicationId);
    this.apiService.updateStatusForApplication(applicationId, e.value).subscribe(data => {
      console.log(data);
    });
  }

  searchThis() {
    this.loading = true;
    this.apiService.searchForApplications(this.searchword)
      .subscribe(data => {
        // this.applications = data;
        this.applications = data.body;

        for (const app of this.applications) {
          const map = new Map<string, EnvType>();
          for (const env of app.environments) {
            let envType: EnvType;
            if (map.has(env.type)) {
              envType = map.get(env.type);
            } else {
              envType = new EnvType();
            }
            envType.name = env.type;
            envType.environments.push(env);
            map.set(env.type, envType);
          }
          const finalTypes: EnvType[] = [];
          map.forEach((value: EnvType, key: string) => {
            finalTypes.push(value);
          });
          app.envTypes = finalTypes;
        }
      },
        error => {

          this.alertService.error(error);
          this.loading = false;
        });
    this.form = this.buildForm();
    this.patchForm(this.application);

  }
}
