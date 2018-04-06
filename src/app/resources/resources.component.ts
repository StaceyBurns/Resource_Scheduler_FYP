import { Component, OnInit, Input} from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import {DatabaseService} from '../shared/database/database.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Resource} from '../shared/interfaces/interfaces';
import {ResourceId} from '../shared/interfaces/interfaces';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})

export class ResourcesComponent implements OnInit {
  activeItem =''; //used to toggle between views in view
  editMode: boolean;

  constructor(private db: DatabaseService){
  }

  ngOnInit(){
    this.db.onSignIn(); // prevents company reset on page reset
    this.resources = this.db.resources; //set resources to db resources to use in
    this.resource = this.db.resource; // set resource observable to db resource to use in view
  }
  resources: any;
  resource: Observable<Resource>;
  selectedResourceId:string;

  getResource(resourceId){ //set data about resource from db
    this.db.getResource(resourceId);
    this.resource = this.db.resource;
  }
  deleteResource(resourceId){ //delete resource from db
    this.db.deleteResource(resourceId);
    this.activeItem = "";
    this.selectedResourceId = null; // set this to null to hide resource detail component
  }
  addResource(name, note, group, schedulingDepend){ //add new resource to db
    this.db.addResource(name, note, group, schedulingDepend);
  }
}
