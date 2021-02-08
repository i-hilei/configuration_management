import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthenticationService} from "./services/authentication.service";
import {Router} from "@angular/router";
import {User} from "./model/user.model";
import {ConfigService} from "./core/config.service";
import  *  as  data  from  "../assets/config/config.json";
import {WebSocketDataService} from "./services/web-socket-data.service";
import {catchError, map, tap} from "rxjs/operators";


import {Subject} from "rxjs";
import {Message} from "./model/message";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'Konfigure.io';
  currentUser: User;
  color: string;
  stage: string;
  searchword: any;
  liveData$: any;
  @Output() searchcriteria = new EventEmitter<String>();

  CHAT_URL = '';

  public messages: Subject<Message>;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private configService: ConfigService,
    private wsDataService: WebSocketDataService
  )
  {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.CHAT_URL = configService.getConfig().wsUrl;
    console.log("Using WS URL " + this.CHAT_URL);
    /*
    this.messages = <Subject<Message>>wsDataService
      .connect(this.CHAT_URL)
      .pipe(map((response: MessageEvent): Message => {
        console.log(response);
        console.log(response.data);
        let data = JSON.parse(response.data);
        return {
          user: data.user,
          message: data.message,
          applicationId : data.applicationId,
          applicationName : data.applicationName
        }
      }));

    this.messages.pipe().subscribe(value => { console.log("Data received from server " + value.applicationId + " " + value.applicationName) });
     */
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.stage = this.configService.getConfig().stage;
    this.color = this.configService.getConfig().colorScheme;




   // this.wsDataService.connect();
    /*
        this.liveData$ = this.wsDataService.messages$.pipe(
          map(rows => rows),
          catchError(error => { throw error }),
          tap({
              error: error => console.log('[Live component] Error:', error),
              complete: () => console.log('[Live component] Connection Closed')
            }
          )
        );
        */

  }


  searchThis() {
    this.searchcriteria.emit(this.searchword)
  }
}
