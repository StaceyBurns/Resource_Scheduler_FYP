import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../../shared/database/database.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Resource} from '../../shared/interfaces/interfaces';
import {ResourceId} from '../../shared/interfaces/interfaces';
import {Group} from '../../shared/interfaces/interfaces';
import {GroupId} from '../../shared/interfaces/interfaces';

@Component({
  selector: 'app-resource-add',
  templateUrl: './resource-add.component.html',
  styleUrls: ['./resource-add.component.css']
})
export class ResourceAddComponent implements OnInit {

  constructor(private db: DatabaseService){
  }

  ngOnInit(){
    this.db.ngOnInit();
    this.resources = this.db.resources;
    this.resource = this.db.resource;
    this.groups = this.db.groups;
    this.group = this.db.group;
  }
  resources: any;
  resource: Observable<Resource>;
  groups: any;
  group: Observable<Group>;

  getResource(resourceId){
    this.db.getResource(resourceId);
    this.resource = this.db.resource;
  }
  deleteResource(resourceId){
    this.db.deleteResource(resourceId);
  }
  addResource(name, note, group){
    this.db.addResource(name, note);
    console.log('Adding resource '+name +' to group ' +group);

  }


  

}