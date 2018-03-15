import { Component, OnInit, Input,  Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {DatabaseService} from '../../shared/database/database.service';
import {Group} from '../../shared/interfaces/interfaces';
import {GroupId} from '../../shared/interfaces/interfaces';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.css']
})
export class GroupEditComponent implements OnInit {

  constructor(private db: DatabaseService) { 
    this.groups = this.db.groups;
    this.group = this.db.group;
  }

  ngOnInit() {
  }

  groups: any;
  @Input() group:Observable<Group>;

  saveEdit(name, note){
    console.log('Name: '+name +' Note ' +note);
    this.db.editGroup(name, note);
  }

}
