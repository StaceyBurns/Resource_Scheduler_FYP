import { Component, OnInit, ViewChild} from '@angular/core';
import {DatabaseService} from '../../shared/database/database.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {CalendarComponent} from "ap-angular2-fullcalendar";
import {Resource} from '../../shared/interfaces/interfaces';
import {Options} from "fullcalendar";
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-calendar-overview',
  templateUrl: './calendar-overview.component.html',
  styleUrls: ['./calendar-overview.component.css'],

})
export class CalendarOverviewComponent{
  resources: any; 
  resource: Observable<Resource>;
  calResources:any;
  calendarOptions: Object; //options to be passed to fullcalendar on calendar initialisation
  loadCalendar:Boolean =false; //don't want the calendar to load until options are set up

  @ViewChild(CalendarComponent) myCalendar: CalendarComponent; //returns first instance of calendar directive

  changeCalendarView(view) { //changes between selected calendar views
    this.myCalendar.fullCalendar('changeView', view);
  }

  constructor(private ngZone: NgZone, private db: DatabaseService){
  }

  ngOnInit(){
    this.db.calResources = []; //set database calresources to an empty array
    this.db.onSignIn(); //call this in case there has been a refresh
    var _this = this;
    this.db.getData(this.db.calResources).then(function() { //return all data from the company schedule in db, only then start setResources
    _this.setResources();
    });

    this.calendarOptions = {  //default calendar settings for component initialisation, will be updated once data is retrieved and options are set
      editable: false, //don't let the user move events on the calendar
      eventLimit: false, //don't set an event limit
      header: { //put these buttons and info in the calendar header
        left: 'prev,next today',
        center: 'title',
        right: 'month, listMonth'
      },
      events: this.calResources //set the events data to this array
    };
    this.resources = this.db.resources; //set local resources to db resources
    this.resource = this.db.resource;
  }


  setResources(){ //sets the calendar options (only runs after db data is returned)
    var _this = this;
    this.calResources= this.db.calResources;
   
    this.calendarOptions = {
      editable: false,
      eventLimit: false,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month, listMonth'
      },
      events: this.calResources ,
    };
    this.loadCalendar = true; //view loads calendat once loadCalendar is set to true
  }
  
  refreshCalendar(){ //hides and reshows the calendar in view to reload data
    let _this = this;
    this.db.calResources =[]; //reset calResources array to empty
    this.db.getData(this.db.calResources).then(function() { //grab the updated data from DB
      _this.refetch(); //then call refetch to set company and calendar options
    }).then(function() {    //hide and reshow the calendar to trigger a refresh
      let l = document.getElementById('fetchButton');
      l.click();
      setTimeout(function(){
        let l = document.getElementById('fetchButton');
        l.click();
      }, 1); 
    });
  }

  refetch(){
    let __this = this;
    this.ngZone.run(() => { //set loadCalendar to whatever value it isn't, needs to run inside ngZone as it's outside angulars zone
      __this.loadCalendar = !__this.loadCalendar;
 })
    this.calResources = this.db.calResources; //set the calendar options
    this.db.onSignIn();
    this.calendarOptions = {
      editable: false,
      eventLimit: false,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month, listMonth'
      },
      events: this.calResources
    };
  }
}







