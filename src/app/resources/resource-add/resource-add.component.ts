import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../../shared/database/database.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Resource} from '../../shared/interfaces/interfaces';
import {ResourceId} from '../../shared/interfaces/interfaces';
import {Group} from '../../shared/interfaces/interfaces';
import {GroupId} from '../../shared/interfaces/interfaces';
import {FormsModule} from '@angular/forms';

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
    this.resources = this.db.resources; //ser resources to db resources to use in view
    this.resource = this.db.resource; //set resources observable to db resources to use in view
    this.groups = this.db.groups; //set groups to db groups to use in view
    this.group = this.db.group; //set group observable to db group to use in view
    this.note="";
    this.name="";
  }
  resources: any;
  resource: Observable<Resource>;
  groups: any;
  group: Observable<Group>;
  userMsg:string;
  name:string;
  note:string;

  getResource(resourceId){ //gets data of resource from db
    this.db.getResource(resourceId);
    this.resource = this.db.resource;
  }
  deleteResource(resourceId){ //deletes resource from db
    this.db.deleteResource(resourceId);
  }
  addResource(name, note, group, schedulingDepend){ //adds resource to db
    this.db.addResource(name, note, group, schedulingDepend);
    this.userMsg = name + ' added!';
    
  }


  

}