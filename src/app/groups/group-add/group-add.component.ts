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
  }

  ngOnInit() {
  }

  groups: any;
  group: Observable<Group>;
  userMsg:string;

  getGroup(groupId){
    this.db.getGroup(groupId);
    this.group = this.db.group;
  }
  deleteGroup(groupId){
    this.db.deleteGroup(groupId);
  }
  addGroup(name, note){
    this.db.addGroup(name, note);
    this.userMsg = name + ' added!';

  }

}
