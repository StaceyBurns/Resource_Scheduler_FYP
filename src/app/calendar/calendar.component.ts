import { Component, OnInit, ViewChild, Input} from '@angular/core';
import * as moment from 'moment';
import {DatabaseService} from '../shared/database/database.service';
import { Observable } from 'rxjs/Observable';
import {Group} from '../shared/interfaces/interfaces';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [DatabaseService]
})
export class CalendarComponent implements OnInit {

  constructor(private db: DatabaseService) { }
  

  ngOnInit() {
    this.dayString = this.days[this.d.getDay()]; //set dayString to today in string
    this.dayNum = this.d.getDate(); //set dayNum to tody in num
    this.monthNum = this.d.getMonth(); //set monthNum in num
    this.monthNum = this.monthNum +1; //add one to monthNum (monthNum is a month behind because of array index)
    this.monthString = this.months[this.d.getMonth()]; //set monthString to this month in string
    this.year = this.d.getFullYear(); //set year to this year in num
    this.updateDate(); //date setup function
    this.getMonthLength(); //get the length in days of the current month
    this.getDays(); //get the days in the month
    this.db.onSignIn(); //call this in case there has been a refresh
    this.resources = this.db.resources; //set resources to db resources
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

  daysInMonth =[];
  monthLength:number;
  d = new Date(); //set d to a new date (todays date)
  days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]; // an array of days in the week
  months = ["NaM", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; //An array of months in the year
  calDisplay = this.monthString + ', ' + this.year; //set the calDisplay string to display on calender head

getDays(){ //get the days in the month, format them
  this.daysInMonth = []; //set to empty array
  for (let i = 1; i < this.monthLength; i++) { //for each day in the month
    var date = new Date(this.monthString + i + ',' + this.year); //make a new date in this format
    var monthSeperator;

    if(this.monthNum <=9){ //format the date accordingly depending on month
      monthSeperator = '-0';
    } else{
      monthSeperator ='-';
    }

  if(i<=9){ //format the date accordingly depending on day
    var dateID =+ this.year +monthSeperator+this.monthNum +'-0'+i;
    }else {
      var dateID =+ this.year + monthSeperator+this.monthNum +'-'+i;
    }
    var day = this.days[date.getDay()]; //make a newDay object and push it to the daysInMonth array
    let newDay = {
      dayNum:i.toString(),
      year: this.year,
      dayString: day,
      dateID: dateID
    };
    this.daysInMonth.push(newDay);
  }
}

prevMonth(){ //change the month to previous month in year
  this.monthNum --;
  this.updateDate();
}

nextMonth(){ //change month to next month in year
  this.monthNum ++;
  this.updateDate();
}

updateDate() { //check month bounds and updates accordingly if out of bounds, populates data for updated date
  if (this.monthNum >12) {
    this.monthNum = 1;
    this.year ++;
  } else if (this.monthNum <1) {
    this.monthNum = 12;
    this.year --;
  }
  this.monthString = this.months[this.monthNum];
  this.calDisplay = this.monthString + ',' + this.year;
  this.getMonthLength();
  this.getDays();
}

getMonthLength(){ // sets the length of the month depending on the string passed in
  if(this.monthString == 'Jan' || this.monthString == 'Mar' || this.monthString == 'May' || this.monthString == 'Jul' || this.monthString == 'Aug' || this.monthString == 'Oct' || this.monthString == 'Dec'){
    this.monthLength = 32;
  } else if(this.monthString == 'Feb') {
    this.monthLength = 29;
  } else{
    this.monthLength = 31;
  }
}

deleteCalEvent(dateID, resourceTitle){ //deleted the selected item
  this.db.deleteCalEvent(dateID, resourceTitle);
}

@Input() group:Observable<Group>; //get the group that is passed in from parent (optional)
@Input() view:string; //get the view that is passed in from parent

}



