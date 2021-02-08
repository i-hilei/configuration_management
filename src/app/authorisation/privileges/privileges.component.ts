import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privileges',
  templateUrl: './privileges.component.html',
  styleUrls: ['./privileges.component.scss']
})
export class PrivilegesComponent implements OnInit {
  searchword: any;

  constructor() { }

  ngOnInit() {
  }

  searchThis() {

  }

  createNewPrivilege() {
    console.log("create new privilege");
/*
    const dialogRef = this.dialog.open(AppsNewComponent, {
      width: '550px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      //this.loadApplications();
    });
*/
  }

}
