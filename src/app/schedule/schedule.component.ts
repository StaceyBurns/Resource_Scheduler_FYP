import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import {DatabaseService} from '../shared/database/database.service';
import {CalendarOverviewComponent} from '../calendar/calendar-overview/calendar-overview.component';
import {CalendarComponent} from '../calendar/calendar.component';
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
    this.schedulingType ="";
  }
  loadedDisplay = 'overview'; // this var is changed in view and toggles the data shown in the view
  selectedGroup:string; // keeps track of which group has been last selected
  userMsg:string;
  schedulingType: string;

  groups: any;
  group: Observable<Group>;
  resources: Observable<Resource[]>;
  resource: Observable<Resource>;

  constructor(public schedule: CalendarComponent, private db: DatabaseService, private calendar:CalendarOverviewComponent) {
}

scheduleSingleResource(resource:string, date:Date,  resourceID){ // schedules a single resource on a single date
let _this = this;
  this.db.getScheduledDates(resource).then(function(){ //Gets previously scheduled dates for resource and adds them to fresh loadedResourceDates array
      if(_this.db.loadedResourceDates.includes(date)){ // if the date already exists in the array (has already been scheduled), tell the user
        console.log('this resource has already been scheduled for ' + date);
        _this.userMsg ='This resource has already been scheduled for ' + date;
      } else{ // if the date doesn't exist in the array (hasn't previously been scheduled)
      _this.db.scheduleSingleResource(resource, date).then(function() { //add the scheduled date to database
      _this.refreshCalendar(); //refresh the calendar to show updated data
      _this.userMsg = resource + ' scheduled for '+ date; //let the user know the action was successful
        })
      }
   })
}

scheduleResourceToResource(resource1:string, resource2:string, date:Date,  resourceID){ //schedule a resource againts another resource
  let _this = this;
    this.db.getScheduledDates(resource1).then(function(){ // check the scheduled dates for first resource
        if(_this.db.loadedResourceDates.includes(date)){ // if the date has already been scheduled, tell the user and don't add the date
          _this.userMsg =resource1 + 'This resource has already been scheduled for ' + date;
        } else{ //if the date doesn't already exist, check scheduled dates for resource 2
          _this.db.getScheduledDates(resource2).then(function(){ // if date exists for resource 2, tell user and don't add to db
            if(_this.db.loadedResourceDates.includes(date)){
              console.log(resource2+ ' has already been scheduled for ' + date);
              _this.userMsg = resource2 + 'This resource has already been scheduled for ' + date;
            }else { // if date passes checks,  schedule the resources in the schedules collection and add the resource-resource dependency in the resource collection for both resources
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
        _this.refreshCalendar(); //refresh the calendar to show updated data
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








