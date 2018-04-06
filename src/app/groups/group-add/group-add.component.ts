import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../../shared/database/database.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Group} from '../../shared/interfaces/interfaces';
import {GroupId} from '../../shared/interfaces/interfaces';

@Component({
  selector: 'app-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.css']
})
export class GroupAddComponent implements OnInit {

  constructor(private db: DatabaseService){
    this.db.ngOnInit();
    this.groups = this.db.groups;
    this.group = this.db.group;
    this.name ="";
    this.note ="";
  }

  ngOnInit() {
  }

  groups: any;
  group: Observable<Group>;
  userMsg:string;
  name:string;
  note:string;

  addGroup(name, note){ //adds group to database, gives user feedback
    this.db.addGroup(name, note);
    this.userMsg = name + ' added!';

  }

}
