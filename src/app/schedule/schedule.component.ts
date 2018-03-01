import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import {DatabaseService} from '../shared/database/database.service';




@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {


  ngOnInit() {
  }
  loadedDisplay = 'resources';

  dbResources: Observable<any[]>;
  constructor(af:AngularFirestore, private db: DatabaseService) {
    // console.log(af);
    this.dbResources = af.collection('resource').valueChanges();
}

takeForm(date:Date, resource:string){

  console.log(date +' ' +resource);
  this.db.testAddDate(date, resource);
}


addTodo(title:string) {
  console.log(title);
  
}

  
};








