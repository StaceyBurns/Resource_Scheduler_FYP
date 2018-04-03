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
    this.resources = this.db.resources; //set local resources var to db resources, to use in view
    this.resource = this.db.resource; //set local resource var to db resource, to use in view
    this.groups = this.db.groups; //set local groups var to db groups, to use in view
    this.group = this.db.group; //set local group var to db group, to use in view
    this.selectedGroup = "noDependencySelected"; //set selected group as noDependencySelected for default (this will let all groups through the filter on load)
    this.userMsg = "";
  }
  loadedDisplay = 'resources'; // this var is changed in view and toggles the data shown in the view
  selectedGroup:string; // keeps track of which group has been last selected
  userMsg:string;

  groups: any;
  group: Observable<Group>;
  resources: Observable<Resource[]>;
  resource: Observable<Resource>;

  constructor(private db: DatabaseService, private calendar:CalendarOverviewComponent) {
}

scheduleSingleResource(resource:string, date:Date,  resourceID){
let _this = this;
  console.log(date +' ' +resource + ' with ID ' + resourceID);
  this.db.getScheduledDates(resource).then(function(){
      if(_this.db.loadedResourceDates.includes(date)){
        console.log('this resource has already been scheduled for ' + date);
        _this.userMsg ='This resource has already been scheduled for ' + date;
      } else{
      _this.db.scheduleSingleResource(resource, date).then(function() {
      _this.refreshCalendar();
      _this.userMsg = resource + ' scheduled for '+ date;
        })
      }
   })
}

scheduleResourceToResource(resource1:string, resource2:string, date:Date,  resourceID){
  let _this = this;
    console.log(date +' ' +resource1 + ' with ID ' + resourceID);
    console.log('RESOURCe 1 is ' +resource1+ ' RESOURCE 2 is ' + resource2)
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
        _this.db.scheduleSingleResource(resource1, date);
        _this.db.scheduleResourceToResource(resource1, resource2, date).then(function(){
          setTimeout(function(){ //not sure how to have second call to db.scheduleResourceToResource call after 1st has returned fully completed
            // causing issue where they resource-resource arrays are updated at the same time for both resources and so one resource is scheduled to itself
            // using timout as a temporary workaround to prototype this feature
            _this.db.scheduleResourceToResource(resource2, resource1, date)
          }, 5000); 
        })
        _this.db.scheduleSingleResource(resource2, date);
        _this.userMsg = resource1 + ' scheduled with ' +resource2+ ' for '+ date;
            }
          })
        }
     })
  }

filterByGroup(group:string){ //filters the resource observable to include only resources from the group passed in 
  this.db.filterByGroup(group)
  this.selectedGroup = group; //set the selectedGroup to the group passed in
}

refreshCalendar(){ //refreshes the overview calendar to show new data (by hiding and showing)
  this.calendar.refreshCalendar();
  console.log("refresh calendar...................");
}
  
};








