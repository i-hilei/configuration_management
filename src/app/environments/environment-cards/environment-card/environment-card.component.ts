import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Environment, Host} from "../../../model/environment.model";
import {Status, Tag} from "../../../model/application.model";
import {ActionEventArgs,BeginEditEventArgs} from "@syncfusion/ej2-angular-inplace-editor";
import {ApiService} from "../../../core/api.service";
import {AlertService} from "../../../services/alert.service";
import {User} from "../../../model/user.model";

@Component({
  selector: 'app-environment-card',
  templateUrl: './environment-card.component.html',
  styleUrls: ['./environment-card.component.scss']
})
export class EnvironmentCardComponent implements OnInit {

  @Input() environment: Environment;


  amountOfServersPerType = new Map([]);

  owner:User[]=[];

//  @ViewChild('dropdownEle1')
//  @ViewChild('dropdownEle2')

  tag:Tag;
  options =[
    {key: 'ACTIVE', value: 'ACTIVE'},
    {key: 'DECOMISSIONED', value: 'DECOMISSIONED'},
    {key: 'LOCKED', value: 'LOCKED'},
    {key: 'PASSIVE', value: 'PASSIVE'},
    {key: 'TOBEREVIEWEDAFTERIMPORT', value: 'TOBEREVIEWEDAFTERIMPORT'}
  ];

  booleanOptions =[
    {key: true, value: 'true'},
    {key: false, value: 'false'}
  ];

  typeOptions =[
    {key: 'UNKNOWN', value: 'UNKNOWN'},
    {key: 'DEVELPOMENT', value: 'DEVELPOMENT'},
    {key: 'INTEGRATION', value: 'INTEGRATION'},
    {key: 'UAT', value: 'UAT'},
    {key: 'PRODUCTION', value: 'PRODUCTION'},
    {key: 'OTHER', value: 'OTHER'},
    {key: 'TEMPORARY', value: 'TEMPORARY'}
  ];

  public fields: object = { text: 'value' };
  public ownerFields: object = { text: 'name', value : 'id' };

  public booleanModel: object = { dataSource: this.booleanOptions, fields: this.fields, placeholder: 'Select an option'};

  public model: object = { dataSource: this.options, fields: this.fields, placeholder: 'Select an option'};

  public typeModel: object = { dataSource: this.typeOptions, fields: this.fields, placeholder: 'Select an option'};

  public ownerModel: object;
  public ownerDelegateModel: object;

  constructor(private apiService: ApiService,
              private alertService: AlertService) { }

  ngOnInit(): void
  {
    this.apiService.getUsersEligebleForEnvironment(this.environment.id).subscribe(data =>{
      this.owner = data.body;
      this.ownerModel = { dataSource: this.owner, fields: this.ownerFields, placeholder: 'Select an option',itemTemplate:"<span><span class='name'>${preName} </span><span class ='city'>${name}</span></span>"};
      this.ownerDelegateModel = { dataSource: this.owner, fields: this.ownerFields, placeholder: 'Select an option',itemTemplate:"<span><span class='name'>${preName} </span><span class ='city'>${name}</span></span>"};
    });

//    for(var comp of this.environment.childs)
//    {
//      console.log((<Host>comp).function);
//    }

    const webserver = this.environment.childs.reduce((acc, cur) => (<Host>cur).function === 'WEBSERVER' ? ++acc : acc, 0);

    const appserver = this.environment.childs.reduce((acc, cur) => (<Host>cur).function === 'APPLICATIONSERVER' ? ++acc : acc, 0);

    const dbserver = this.environment.childs.reduce((acc, cur) => (<Host>cur).function === 'DATABASESERVER' ? ++acc : acc, 0);

    const docker = this.environment.childs.reduce((acc, cur) => (<Host>cur).function === 'DOCKER' ? ++acc : acc, 0);

    const util = this.environment.childs.reduce((acc, cur) => (<Host>cur).function === 'UTIL' ? ++acc : acc, 0);

    const batch = this.environment.childs.reduce((acc, cur) => (<Host>cur).function === 'BATCH' ? ++acc : acc, 0);

    const compute = this.environment.childs.reduce((acc, cur) => (<Host>cur).function === 'COMPUTE' ? ++acc : acc, 0);

    const other = this.environment.childs.reduce((acc, cur) => (<Host>cur).function === 'OTHER' ? ++acc : acc, 0);

    const unknown = this.environment.childs.reduce((acc, cur) => (<Host>cur).function === 'UNKOWN' ? ++acc : acc, 0);

    this.amountOfServersPerType.set('WebServer',webserver);
    this.amountOfServersPerType.set('ApplicationServer',appserver);
    this.amountOfServersPerType.set('DBServer',dbserver);
    this.amountOfServersPerType.set('Docker',docker);
    this.amountOfServersPerType.set('Util',util);
    this.amountOfServersPerType.set('Batch',batch);
    this.amountOfServersPerType.set('Compute',compute);
    this.amountOfServersPerType.set('OTHER',other);
    this.amountOfServersPerType.set('UNKOWN',other);
  }

  onItemAdded($event: Tag,id:number)
  {
    console.log($event);

    this.apiService.getTagByNameOrCreate($event.tag)
      .subscribe( data => {
        console.log("status: " + data.status);
        console.log("data: " + data.body.tag);
        this.tag = data.body;

        this.apiService.addTagToEnvironment(id,this.tag.id)
          .subscribe(data =>{
            console.log(data);
          });
      })
  }

  onItemRemoved($event: Tag, id: number) {
    console.log("removing tag with id " + $event.id);
    this.apiService.removeTagFromEnvironment(id,$event.id).subscribe(data =>{
      console.log(data);
    });
  }

  convertToBoolean(input: string): boolean | undefined {
    try {
      return JSON.parse(input);
    }
    catch (e) {
      return undefined;
    }
  }

  actionSuccess(e: ActionEventArgs,environmentId:number) {
    console.log("Changing status to "+ e.value + " for environment " + environmentId);

    this.environment.status = Status[e.value];
    this.apiService.updateEnvironment(environmentId,this.environment).subscribe(data =>{
      console.log(data);
      this.environment = data;
    });
  }
  public actionSuccessAutoDeployable(e: ActionEventArgs,environmentId:number): void {
    console.log("Changing autodeployable to "+ e.value + " for environment " + environmentId);

    this.environment.isAutoDeployable = this.convertToBoolean(e.value);
    this.environment.autoDeployable = this.convertToBoolean(e.value);
    this.apiService.updateEnvironment(environmentId,this.environment).subscribe(data =>{
      console.log(data);
      this.environment = data;
    });
  }

  public actionSuccessChangeControl(e: ActionEventArgs,environmentId:number): void {

    console.log("Changing changeControl to "+ e.value + " for environment " + environmentId);
    this.environment.isUnderChangeControl = this.convertToBoolean(e.value);
    this.environment.underChangeControl = this.convertToBoolean(e.value);

    this.apiService.updateEnvironment(environmentId,this.environment).subscribe(data =>{
      console.log(data);
    });
  }

  public actionSuccessType(e: ActionEventArgs,environmentId:number): void {
    console.log("Changing type to "+ e.value + " for environment " + environmentId);

    this.environment.type = e.value;

    this.apiService.updateEnvironment(environmentId,this.environment).subscribe(data =>{
      console.log(data);
    });
  }

  actionSuccessAutoApprove(e: ActionEventArgs,environmentId:number) {
    console.log("Changing autoApprove to "+ e.value + " for environment " + environmentId);
    this.environment.isAutoApprove = this.convertToBoolean(e.value);
    this.environment.autoApprove = this.convertToBoolean(e.value);

    this.apiService.updateEnvironment(environmentId,this.environment).subscribe(data =>{
      console.log(data);
    });

  }

  actionSuccessOwner(e: ActionEventArgs,environmentId:number) {
    console.log("Changing owner to "+ e.value + " for environment " + environmentId);
    this.apiService.updateOwnerForEnvironment(environmentId,Number(e.value).valueOf() ).subscribe(data =>{
      console.log(data);
      this.environment = data.body;
    });
  }

  actionSuccessDelegate(e: ActionEventArgs,environmentId:number) {
    console.log("Changing ownerDelegate to "+ e.value + " for environment " + environmentId);
    this.apiService.updateOwnerDelegateForEnvironment(environmentId,Number(e.value).valueOf() ).subscribe(data =>{
      console.log(data);
      this.environment = data.body;
    });

  }
}
