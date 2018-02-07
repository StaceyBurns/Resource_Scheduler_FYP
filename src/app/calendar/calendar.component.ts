import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import {DatabaseService} from '../shared/database/database.service';
// import { Observable } from 'rxjs/Observable';

let now = moment().format('LLLL');

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [DatabaseService]
})
export class CalendarComponent implements OnInit {

  constructor(private db: DatabaseService) { }
  

  ngOnInit() {
    this.dayString = this.days[this.d.getDay()];
    this.dayNum = this.d.getDate();
    this.monthNum = this.d.getMonth();
    this.monthString = this.months[this.d.getMonth()];
    this.year = this.d.getFullYear();
    this.updateDate();
    this.getDays();
    this.db.ngOnInit();
    this.resources = this.db.resources;
    this.resource = this.db.resource;
    console.log('Resources: ' +this.resources);
    console.log('Resource: ' +this.resource);
 
  }
  dayString: any;
  dayNum: any;
  monthNum: any;
  monthString: any;
  year: any;

  resources: any;
  resource: any;

// calDisplay = this.dayString + ',' + this.dayNum + ',' + this.monthString + ',' + this.year;
calDisplay = this.monthString + ',' + this.year;
d = new Date();
days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
months = ["NaM", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
daysInMonth =[];

getDays(){
this.daysInMonth = [];
for (let i = 1; i < 32; i++) {
  var date = new Date(this.monthString + i + ',' + this.year);
  var dateID = i+"" +"" + this.monthNum + this.year;
  var dayInMonth = new Date(this.monthNum + i + this.year);
  var day = this.days[date.getDay()];

  let newDay = {
     dayNum:i.toString(),
     year: this.year,
     dayString: day,
     dateID: dateID
  };
  this.daysInMonth.push(newDay);
  console.log("date ID " +dateID);
}
}

prevMonth(){
  this.monthNum --;
  this.updateDate();
  console.log('month ' +this.monthNum);
}

nextMonth(){
  this.monthNum ++;
  this.updateDate();
}

updateDate() {
  if (this.monthNum >12) {
    this.monthNum = 1;
    this.year ++;
  } else if (this.monthNum <1) {
    this.monthNum = 12;
    this.year --;
  }
  this.monthString = this.months[this.monthNum];
  // this.calDisplay = this.dayString + ',' + this.dayNum + ',' + this.monthString + ',' + this.year;
  this.calDisplay = this.monthString + ',' + this.year;
  console.log(moment(this.year + '-' + this.monthNum, "YYYY-MM").daysInMonth())
  console.log(this.daysInMonth);
  console.log(this.d);
  this.getDays();
}


}



