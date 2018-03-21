import { Component, OnInit, ViewChild} from '@angular/core';
import {DatabaseService} from '../../shared/database/database.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {CalendarComponent} from "ap-angular2-fullcalendar";
import {Resource} from '../../shared/interfaces/interfaces';
import { createAotUrlResolver } from '@angular/compiler';
import {Options} from "fullcalendar";
import * as $ from 'jquery';
import { NgZone } from '@angular/core';
// import {ResourceId} from '../../shared/interfaces/interfaces';

@Component({
  selector: 'app-calendar-overview',
  templateUrl: './calendar-overview.component.html',
  styleUrls: ['./calendar-overview.component.css'],

})
export class CalendarOverviewComponent{
  resources: any;
  resource: Observable<Resource>;
  calResources:any;
  calendarOptions: Object;
  loadCalendar:Boolean =false;

  @ViewChild(CalendarComponent) myCalendar: CalendarComponent;


  changeCalendarView(view) {
    this.myCalendar.fullCalendar('changeView', view);
  }


  constructor(private ngZone: NgZone, private db: DatabaseService){

  }




  ngOnInit(){
    this.db.calResources = [];
    this.db.onSignIn();
    var _this = this;
    this.db.getData(this.db.calResources).then(function() {
    _this.setResources();
    console.log('()()()()()()---Calendar initialized----()()()()()')
    });

    this.calendarOptions = {
      editable: true,
      eventLimit: false,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listMonth'
      },
      events: this.calResources
    };
    this.resources = this.db.resources;
    this.resource = this.db.resource;
  }


  setResources(){
    var _this = this;
    this.calResources= this.db.calResources;
   
    this.calendarOptions = {
      editable: false,
      eventLimit: false,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listMonth'
      },
      events: this.calResources ,
    };
    console.log('CAL resources');
    console.log(this.calResources);
    this.loadCalendar = true;
  }

  secondCal = false;
  
  refreshCalendar(){
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
    this.ngZone.run(() => {
      __this.loadCalendar = !__this.loadCalendar;
 })
    this.calResources = this.db.calResources;
    console.log('fetching');
    this.db.onSignIn();
 
    console.log('load cal status..........' + this.loadCalendar)
    this.calendarOptions = {
      editable: true,
      eventLimit: false,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listMonth'
      },
      events: this.calResources
    };
  }


  makeCalendar(){
    
    this.calResources= this.db.calResources;

    this.calendarOptions = {
        // height: 'parent',
        fixedWeekCount : false,
        defaultDate: '2018-02-02',
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        // defaultView: "basicWeek",
        // events: this.calResources,
        events: []
    }
  }





}







