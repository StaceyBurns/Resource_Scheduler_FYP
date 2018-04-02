import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import {DatabaseService} from '../shared/database/database.service';
import {CalendarOverviewComponent} from '../calendar/calendar-overview/calendar-overview.component';
import {Resource} from '../shared/interfaces/interfaces';
import {ResourceId} from '../shared/interfaces/interfaces';
import {Group} from '../shared/interfaces/interfaces';
import { NotifyService, Msg } from '../core/notify.service';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';

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
    this.selectedGroup = "noDependencySelected";
    this.userMsg = "";
  }
  loadedDisplay = 'resources';
  selectedGroup:string;

  groups: any;
  group: Observable<Group>;


  dbResources: Observable<any[]>;

  userMsg:string;

  constructor(private db: DatabaseService, private calendar:CalendarOverviewComponent) {
}


resources: Observable<Resource[]>;
resource: Observable<Resource>;

scheduleSingleResource(resource:string, date:Date,  resourceID){
let _this = this;
  console.log(date +' ' +resource + ' with ID ' + resourceID);
  this.db.getScheduledDates(resource).then(function(){
      if(_this.db.loadedResourceDates.includes(date)){
        console.log('this resource has already been scheduled for ' + date);
        _this.userMsg ='This resource has already been scheduled for ' + date;
      } else{
      _this.db.testAddDate(resource, date).then(function() {
      _this.refreshCalendar();
      _this.userMsg = resource + ' scheduled for '+ date;
        })
      }
   })
}

scheduleResourceToResource(resource1:string, resource2:string, date:Date,  resourceID){
  let _this = this;
    console.log(date +' ' +resource1 + ' with ID ' + resourceID);
    this.db.getScheduledDates(resource1).then(function(){
        if(_this.db.loadedResourceDates.includes(date)){
          console.log(resource1 + '  has already been scheduled for ' + date);
          _this.userMsg =resource1 + 'This resource has already been scheduled for ' + date;
        } else{
          _this.db.getScheduledDates(resource2).then(function(){
            if(_this.db.loadedResourceDates.includes(date)){
              console.log(resource2+ ' has already been scheduled for ' + date);
              _this.userMsg = resource2 + 'This resource has already been scheduled for ' + date;
            }else {
              console.log(resource1 +' scheduled');
        _this.db.testAddDate(resource1, date);
        _this.db.testAddDate(resource2, date);
        _this.db.scheduleResourceToResource(resource1, date)
        _this.userMsg = resource1 + ' scheduled with ' +resource2+ ' for '+ date;
            }
          })
        }
     })
  }

filterByGroup(group:string){
  this.db.filterByGrouup(group)
  let _this = this;
  this.selectedGroup = group; 
}

refreshCalendar(){
  this.calendar.refreshCalendar();
  console.log("refresh calendar...................");
}
  
};








