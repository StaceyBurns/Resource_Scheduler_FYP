import { Component, OnInit, ViewChild } from '@angular/core';
import { SeaterPipe } from '../seater.pipe';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import {DatabaseService} from '../shared/database/database.service';
import {CalendarOverviewComponent} from '../calendar/calendar-overview/calendar-overview.component';
import {Resource} from '../shared/interfaces/interfaces';
import {ResourceId} from '../shared/interfaces/interfaces';
import {Group} from '../shared/interfaces/interfaces';
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
    this.groups = this.db.groups;
    this.group = this.db.groups;
    this.db.getdaydata()
    this.selectedGroup = "";
  }
  loadedDisplay = 'resources';
  selectedGroup:string;

  groups: any;
  group: Observable<Group>;


  dbResources: Observable<any[]>;
  constructor(private db: DatabaseService, private calendar:CalendarOverviewComponent) {
}

  // ngOnChanges(){
  //   this.db.filterByGrouup(this.selectedGroup);
  // }

resources: Observable<Resource[]>;
resource: Observable<Resource>;

takeForm(resource:string, date:Date,  resourceID){
let _this = this;
  console.log(date +' ' +resource + ' with ID ' + resourceID);
  this.db.getScheduledDates(resource, date).then(function(){
    _this.db.testAddDate(resource, date);
  }).then(function() {
    _this.refreshCalendar();
   })
}

filterByGroup(group:string){
  this.db.filterByGrouup(group)
  let _this = this;
  this.selectedGroup = group;
  // setTimeout(function(){
  //   _this.resources = _this.db.resources;
  //   _this.resource = _this.db.resource;
  //   console.log('timer done')
  //   console.log(_this.resources)
  //   _this.resources.forEach(item => {
  //     console.log('Item:', item);
  // });
  // }, 1000); 
}

getdaydata(){
  this.db.getdaydata()
}

refreshCalendar(){
  this.calendar.refreshCalendar();
  console.log("refresh calendar...................");
}
  
};








