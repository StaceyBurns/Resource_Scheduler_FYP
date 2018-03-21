import { Component, OnInit, ViewChild} from '@angular/core';
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
    this.monthNum = 2; //get rid of this
    this.monthString = this.months[this.d.getMonth()];
    this.year = this.d.getFullYear();
    this.updateDate();
    this.getMonthLength();
    this.getDays();
    this.db.onSignIn();
    this.resources = this.db.resources;
    this.resource = this.db.resource;

 
  }
  dayString: any;
  dayNum: any;
  monthNum: any;
  monthString: any;
  year: any;

  resources: any;
  resource: any;

  calSelectedDate:any;
  calSelectedResource:any;

// calDisplay = this.dayString + ',' + this.dayNum + ',' + this.monthString + ',' + this.year;
calDisplay = this.monthString + ',' + this.year;
d = new Date();
days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
months = ["NaM", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
daysInMonth =[];

monthLength:number;

getDays(){
this.daysInMonth = [];
for (let i = 1; i < this.monthLength; i++) {
 

  var date = new Date(this.monthString + i + ',' + this.year);

  var dayInMonth = new Date(this.monthNum + i + this.year);

  var monthSeperator 
  if(this.monthNum <=9){
    monthSeperator = '-0';
  } else{
    monthSeperator ='-';
  }

 if(i<=9){
  var dateID =+ this.year +monthSeperator+this.monthNum +'-0'+i;
}else {
  var dateID =+ this.year + monthSeperator+this.monthNum +'-'+i;
}

  var day = this.days[date.getDay()];



  let newDay = {
     dayNum:i.toString(),
     year: this.year,
     dayString: day,
     dateID: dateID
  };
  this.daysInMonth.push(newDay);

}
}

prevMonth(){
  this.monthNum --;
  this.updateDate();
  // console.log('month ' +this.monthNum);
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
  console.log('errrrrr'+this.monthString);
  this.monthString = this.months[this.monthNum];
  this.calDisplay = this.monthString + ',' + this.year;
  this.getMonthLength();
  this.getDays();
  
 
}

getMonthLength(){
  if(this.monthString == 'Jan' || this.monthString == 'Mar' || this.monthString == 'May' || this.monthString == 'Jul' || this.monthString == 'Aug' || this.monthString == 'Oct' || this.monthString == 'Dec'){
    this.monthLength = 32;
    console.log(this.monthString);
    console.log('31 days in this month!!!!!!!!!!!!!!!!!!!!!!!!');
  } else if(this.monthString == 'Feb') {
    this.monthLength = 29;
    console.log('29 days in this month!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  } else{
    this.monthLength = 31;
    console.log('30 days in this month!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  }
  console.log('get month length')
}

editCalEvent(dateID, resourceTitle){
  console.log('day ' + dateID + ' clicked for '+ resourceTitle);
  this.calSelectedDate = dateID;
  this.calSelectedResource = resourceTitle;
  this.deleteCalEvent(dateID, resourceTitle);
}

deleteCalEvent(dateID, resourceTitle){
  this.db.deleteCalEvent(dateID, resourceTitle);
  console.log('delete event');
}







}



