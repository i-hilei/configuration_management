import {Component, Input, OnInit} from '@angular/core';
import {Environment, Host} from "../../../model/environment.model";

@Component({
  selector: 'app-host-card',
  templateUrl: './host-card.component.html',
  styleUrls: ['./host-card.component.scss']
})
export class HostCardComponent implements OnInit {
  @Input() host: Host;

  constructor() { }

  ngOnInit(): void {
  }

}
