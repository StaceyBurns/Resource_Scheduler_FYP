import { Component, OnInit, Input} from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import {DatabaseService} from '../shared/database/database.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Group} from '../shared/interfaces/interfaces';
import {GroupId} from '../shared/interfaces/interfaces';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  constructor(private db: DatabaseService) { }

  ngOnInit() {
    this.db.onSignIn(); // prevents company reset on page reset
    this.groups = this.db.groups;
    this.group = this.db.groups;
  }
  groups: any;
  group: Observable<Group>;
  selectedGroupId:string; //holds reference to the last clicked group
  activeItem: string; //holds reference to the view that is active, updated in view

  getGroup(groupId){ //gets group data from db
    this.db.getGroup(groupId);
    this.group = this.db.group;
  }
  deleteGroup(groupId){ //deleted group from db
    this.db.deleteGroup(groupId);
    this.selectedGroupId = null;
  }
  addGroup(name, note){ //adds group to db
    this.db.addGroup(name, note);

  }

}
