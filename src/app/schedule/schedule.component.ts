import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import {DatabaseService} from '../shared/database/database.service';
import {CalendarOverviewComponent} from '../calendar/calendar-overview/calendar-overview.component';
import {Resource} from '../shared/interfaces/interfaces';
import {ResourceId} from '../shared/interfaces/interfaces';
import 'rxjs/add/operator/map';




@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {


  ngOnInit() {
    this.db.onSignIn(); // prevents company reset on page reset
    this.resources = this.db.resources;
    this.resource = this.db.resource;
    this.db.getdaydata()
  }
  loadedDisplay = 'resources';

  dbResources: Observable<any[]>;
  constructor(af:AngularFirestore, private db: DatabaseService, private calendar:CalendarOverviewComponent) {
    // console.log(af);

}

resources: any;
resource: Observable<Resource>;

takeForm(date:Date, resource:string){
let _this = this;
  console.log(date +' ' +resource);
  this.db.testAddDate(date, resource).then(function() {
   _this.refreshCalendar();
   console.log(_this);
  });
}


addTodo(title:string) {
  console.log(title);
  
}

getdaydata(){
  this.db.getdaydata()
}

refreshCalendar(){
  this.calendar.refreshCalendar();
  console.log("refresh calendar...................");
}

  
};








