import {User} from "./user.model";
import {Role} from "./group.model";
import {Status, Tag} from "./application.model";

export class InfrastructureComponent{
  id : number ;
  name : string;
  displayName : string;
  type:string;
  image : string;
  status : Status;
  version: string;
  approvers : Role;
  tags: Tag[];
  applicationIdentifier : ShortApplicationIdentication[];
  childs : InfrastructureComponent[];
  createDate : Date;
  modifyDate : Date;

}

class ShortApplicationIdentication {
  displayName: string;
  identifier: string;
  name: string;
}

export class Host extends InfrastructureComponent {
  function : string;
  fqdn : string;
}

export class Environment extends InfrastructureComponent{

  identifier : string;
  owner: User;
  isAutoDeployable: boolean ;
  isUnderChangeControl: boolean;
  isAutoApprove:boolean;
  //@ToDo fix duplicates
  autoDeployable: boolean ;
  underChangeControl: boolean;
  autoApprove:boolean;
  deployedApplicationVersion: string;
  ownerDelegate : User;
}

export class InfrastructureResponse{
  count : number ;
  result : Host[];
  currentPage : number;
  numberOfPages : number;
}
