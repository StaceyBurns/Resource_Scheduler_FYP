import { Component, OnInit, Input,  Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {DatabaseService} from '../../shared/database/database.service';
import {Resource} from '../../shared/interfaces/interfaces';
import {ResourceId} from '../../shared/interfaces/interfaces';
import {Group} from '../../shared/interfaces/interfaces';

@Component({
  selector: 'app-resource-edit',
  templateUrl: './resource-edit.component.html',
  styleUrls: ['./resource-edit.component.css']
})
export class ResourceEditComponent implements OnInit {

  constructor(private db: DatabaseService) { 
    this.resources = this.db.resources;
    this.resource = this.db.resource;
    this.groups = this.db.groups;
    this.group = this.db.group;
  }

  ngOnInit() {
  }

  resources: any;
  groups: any;
  group: Observable<Group>;
  userMsg:string;
  @Input() resource:Observable<Resource>;

  saveEdit(name, note, group, schedulingDepend){ //update edited resource data in db
    console.log('Name: '+name +' Note ' +note);
    this.db.editResource(name, note, group, schedulingDepend);
    this.userMsg = "Updated!";
  }

}

