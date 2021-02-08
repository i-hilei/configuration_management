import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import { faCoffee,faCheckCircle, } from '@fortawesome/free-solid-svg-icons';
import {ApiService} from "../../core/api.service";
import {AuthenticationService} from "../../services/authentication.service";
import {AlertService} from "../../services/alert.service";
import {Application, EnvType, Tag} from "../../model/application.model";

@Component({
  selector: 'app-application-overview',
  templateUrl: './application-overview.component.html',
  styleUrls: ['./application-overview.component.scss']
})
export class ApplicationOverviewComponent implements OnInit {
  @Input() application: Application;

  faCoffee = faCoffee;
  faCheckCircle = faCheckCircle;

  tag:Tag;

  options =[
    {key: 'ACTIVE', value: 'ACTIVE'},
    {key: 'DECOMISSIONED', value: 'DECOMISSIONED'},
    {key: 'LOCKED', value: 'LOCKED'},
    {key: 'PASSIVE', value: 'PASSIVE'},
    {key: 'TOBEREVIEWEDAFTERIMPORT', value: 'TOBEREVIEWEDAFTERIMPORT'}
  ];

  constructor(private snackBar: MatSnackBar,
              private router: Router,
              private route: ActivatedRoute,
              private apiService: ApiService,
              private authenticationService: AuthenticationService,
              private alertService: AlertService
) { }

  ngOnInit() {
    console.log("User in ApplicationsOverviewComponent " + this.authenticationService.currentUserValue.name)
    if(!this.authenticationService.currentUserValue) {
      this.router.navigate(['login']);
      return;
    }

    this.apiService.findApplicationById(this.route.snapshot.params['applicationid'])
      .subscribe(data => {
        console.log("status :" + data);
        this.application = data;

          let map = new Map<string,EnvType >();
          for(var env of this.application.environments)
          {
            var envType: EnvType;
            if(map.has(env.type))
            {
              envType = map.get(env.type);
            }
            else
            {
              envType = new EnvType();
            }
            envType.name = env.type;
            envType.environments.push(env)
            map.set(env.type,envType)
          }
          var finalTypes : EnvType[] = [];
          map.forEach((value: EnvType, key: string) => {
            finalTypes.push(value)
          });
        this.application.envTypes = finalTypes;

      });

  }

  save($event:any,applicationId:number) {
    console.log("Changing status to "+ $event + " for application " + applicationId);
    this.apiService.updateStatusForApplication(applicationId,$event).subscribe(data =>{
      console.log(data);
    });
  }

  onItemAdded($event: Tag,id:number)
  {
    console.log($event);

    this.apiService.getTagByNameOrCreate($event.tag)
      .subscribe( data => {
        //this.applications = data;
        console.log("status: " + data.status);
        console.log("data: " + data.body.tag);
        this.tag = data.body;

        this.apiService.addTagToApplication(id,this.tag.id)
          .subscribe(data =>{
            console.log(data);
          });
      })
  }

  onItemRemoved($event: Tag, id: number) {
    console.log("removing tag with id " + $event.id);
    this.apiService.removeTagFromApplication(id,$event.id).subscribe(data =>{
      console.log(data);
    });
  }
}
