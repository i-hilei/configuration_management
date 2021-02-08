import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../core/api.service';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {User} from '../../model/user.model';
import {Environment} from '../../model/environment.model';
import {Version} from '../../model/configuration.model';


@Component({
  selector: 'app-application-edit',
  templateUrl: './application-edit.component.html',
  styleUrls: ['./application-edit.component.scss']
})
export class ApplicationEditComponent implements OnInit {

  applicationForm: FormGroup;
  id: number = null;
  name = '';
  identifier = '';
  status = '';
  image = '';
  version: Version[];
  owner: User;
  environments: Environment[];
  tags: string[];

  isLoadingResults = false;

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getApplication(this.route.snapshot.params['applicationid']);
    this.applicationForm = this.formBuilder.group({
      'name': [null, Validators.required],
      'identifier': [null, Validators.required],
      'status': [null, Validators.required],
      'image': [null, Validators.required],
      'version': [null, Validators.required],
      'owner': [null, Validators.required],
      'environments': [null, Validators.required],
      'tags': [null, Validators.required]

    });
  }

  getApplication(id) {
    this.api.findApplicationById(id).subscribe(data => {
      this.id = data.id;
      this.applicationForm.setValue({
        name: data.name,
        identifier: data.identifier,
        status: data.status,
        image: data.image,
        version: data.version,
        owner: data.owner,
        environments: data.environments,
        tags: data.tags
      });
    });
  }


  onFormSubmit(form: NgForm) {
    this.isLoadingResults = true;
    /*
    this.api.updateApplication(this.id, form)
      .subscribe(res => {
          let id = res['id'];
          this.isLoadingResults = false;
          this.router.navigate(['/application-details', id]);
        }, (err) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );

     */
  }

  productDetails() {
    this.router.navigate(['/application-details', this.id]);
  }
}
