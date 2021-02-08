import {Environment, InfrastructureComponent} from "./environment.model";
import {Tag} from "./application.model";
import {from} from "rxjs";
import {User} from "./user.model";

export class Version {

  id: number;
  name : string;
  configurationversion : string;
  configurations: Configuration[];
  status : string;
  created : Date;
  creator : User;
}


export class Configuration {
  id: number;
  name : string;
  version : string;
  configurationVersion : string;
  created : Date;
  configurationItems: ConfigurationItem[];
}

export class ConfigurationItem{
  id: number;
  name : string;
  key : string;
  isConfidential:boolean;
  tags: Tag;
  configurationItemValue: ConfigurationItemValue;
  type: Type;
}

export enum Type{
  PASSWORD ="PASSWORD",
  URL ="URL",
  USER = "USER",
  DATABASELINK = "DATABASELINK",
  UNKNOWN="UNKNOWN",
  STRING="String",
  INT="INT"
}

export enum ApprovalStatus{
  TO_BE_APPROVED = "TO_BE_APPROVED",
  APPROVED =" APPROVED",
  DECLINED = "DECLINED"
}

export class ConfigurationItemValue{
  id: number;
  name : string;
  value:any;
  infrastructureComponent : Environment;
  approvalStatus:ApprovalStatus;
  isConfidential : boolean;
}


export class ConfigurationItemResponse{
  configCount : number ;
  data : ConfigurationItem[];
  currentPage : number;
  numberOfPages : number;
}
