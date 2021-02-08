import {User} from "./user.model";

export class Role {
  id: number;
  name : string;
  description : string;
  roles: Role[];
  privileges: Privilege[];
}

export class Group {
  id: number;
  name : string;
  description : string;
  roles: Role[];
  groups: Group[];
}

export class Privilege {
  id: number;
  name : string;
  description : string;
  type : string;
  permission : string;
  domain: string;
  actions: string[];
}

export class RoleResponse{
  roleCount : number ;
  data : Role[];
  currentPage : number;
  numberOfPages : number;
}

export class PrivilegeResponse{
  privilegeCount : number ;
  data : Privilege[];
  currentPage : number;
  numberOfPages : number;
}
