import {User} from "./user.model";
import {Environment} from "./environment.model";
import {Version} from "./configuration.model";
import {Role} from "./group.model";


export class Application {
  id: number;
  name : string;
  displayName : string;
  identifier : string;
  status : string;
  image : string;
  version : Version[];
  owner: User;
  ownerDelegate: User;
  environments: Environment[];
  tags: Tag[];
  roles: Role[];
  envTypes : EnvType[] = [];
  createDate : Date;
  modifyDate : Date;
}

export class Tag {
  id: number;
  tag : string;
}

export class EnvType {
  id: number;
  name : string;
  environments: Environment[] = [];
}

export enum Status{
  ACTIVE = "ACTIVE",
  DECOMISSIONED =" DECOMISSIONED",
  LOCKED = "LOCKED",
  PASSIVE = "PASSIVE",
  TOBEREVIEWEDAFTERIMPORT = "TOBEREVIEWEDAFTERIMPORT"
}
