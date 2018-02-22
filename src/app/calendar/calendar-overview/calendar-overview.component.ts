import { Component, OnInit, ViewChild } from '@angular/core';
import {DatabaseService} from '../../shared/database/database.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {CalendarComponent} from "ap-angular2-fullcalendar";
import {Resource} from '../../shared/interfaces/interfaces';
import { createAotUrlResolver } from '@angular/compiler';
import {Options} from "fullcalendar";
import * as $ from 'jquery';
// import {ResourceId} from '../../shared/interfaces/interfaces';

@Component({
  selector: 'app-calendar-overview',
  templateUrl: './calendar-overview.component.html',
  styleUrls: ['./calendar-overview.component.css']
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


  constructor(private db: DatabaseService){
  }

  ngOnInit(){
    this.db.ngOnInit();
    var _this = this;
    this.db.getData(this.db.calResources).then(function() {
      console.log('get data ----------------------');
    _this.setResources();
    });

    this.calendarOptions = {
      editable: true,
      eventLimit: false,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listMonth'
      },
      events: []
    };


    this.resources = this.db.resources;
    this.resource = this.db.resource;
    // console.log(this.resources);
    // console.log(this.resource);
  }


  setResources(){
    var _this = this;
    this.calResources= this.db.calResources;
    console.log('*******************************************');
    // console.log(this.db.calResources[0]);
    console.log(this.calResources);
   
    this.calendarOptions = {
      editable: false,
      eventLimit: false,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listMonth'
      },
      events: this.calResources,
    };
    $('#calendar').fullCalendar('render');
    console.log('CALENDAR EVENTS SET IN SETRESOURCE');
    console.log(this.calResources);
    this.loadCalendar = true;

  }


  makeCalendar(){
    console.log('start making calendar');

    this.calendarOptions = {
        // height: 'parent',
        fixedWeekCount : false,
        defaultDate: '2018-02-02',
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        // defaultView: "basicWeek",
        // events: this.calResources,
        events: this.calResources
        //  [ {
        //     title: 'All Day Event',
        //     start: '2018-02-02'
        //   },
        //   {
        //     title: 'Long Event',
        //     start: '2018-02-07',
        //     end: '2016-09-10'
        //   },
        //   {
        //     id: 999,
        //     title: 'Repeating Event',
        //     start: '2016-09-09T16:00:00'
        //   },
        //   {
        //     id: 999,
        //     title: 'Repeating Event',
        //     start: '2016-09-16T16:00:00'
        //   },
        //   {
        //     title: 'Conference',
        //     start: '2016-09-11',
        //     end: '2016-09-13'
        //   },
        //   {
        //     title: 'Meeting',
        //     start: '2016-09-12T10:30:00',
        //     end: '2016-09-12T12:30:00'
        //   },
        //   {
        //     title: 'Lunch',
        //     start: '2016-09-12T12:00:00'
        //   },
        //   {
        //     title: 'Meeting',
        //     start: '2016-09-12T14:30:00'
        //   },
        //   {
        //     title: 'Happy Hour',
        //     start: '2016-09-12T17:30:00'
        //   },
        //   {
        //     title: 'Dinner',
        //     start: '2016-09-12T20:00:00'
        //   },
        //   {
        //     title: 'Birthday Party',
        //     start: '2016-09-13T07:00:00'
        //   },
        //   {
        //     title: 'Click for Google',
        //     url: 'http://google.com/',
        //     start: '2016-09-28'
        //   }
        // ],

    }
    console.log('makecalendar function');

  }





}







