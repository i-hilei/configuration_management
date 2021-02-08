import {Component, Inject, OnInit, AfterViewInit, ViewChild} from '@angular/core';

import { ApiService } from 'src/app/core/api.service';
import {MatSort} from "@angular/material/sort";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-applicationconfigurationmodal',
  templateUrl: 'applicationconfigurationmodal.component.html',
})
export class Applicationconfigurationmodal implements OnInit {
  displayedColumns = ['id', 'name', 'key','isConfidential','tags','scope','values','action'];
  dataSource;
  @ViewChild(MatSort,{static:false}) sort: MatSort;
  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<Applicationconfigurationmodal>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {  }

  ngOnInit() {
    this.dataSource = this.data ;
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  updateConfigurationItem(configId, configuration){
    this.apiService.updateConfigurationItem(configId, configuration).subscribe();
  }

}
