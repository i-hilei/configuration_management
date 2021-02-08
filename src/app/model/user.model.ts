import {Group, Role} from "./group.model";
import {Application, Tag} from "./application.model";


class ShortApplicationIdentifier {
  identifier : string;
  name : string;
  displayName : string;
}

export class User {
  id: number;
  userId : string;
  // userid : string;
  name : string;
  preName : string;
  email: string;
  groups : Group[]
  roles : Role[];
  token: string;
  technical:boolean;
  status : string;
  tags: Tag[];
  applicationIdentifiers:ShortApplicationIdentifier[]
  applicationDelegateIdentifiers:ShortApplicationIdentifier[]
  failedAttempts : number;
  passwordExpired : boolean;
  lastLogin : Date;
  lastFailedLogin : Date;
}

export class UserResponse{
  count : number ;
  result : User[];
  currentPage : number;
  numberOfPages : number;
}
