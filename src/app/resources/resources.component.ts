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
  activeItem ='';
  editMode: boolean;

  constructor(private db: DatabaseService){
  }

  ngOnInit(){
    this.db.onSignIn(); // prevents company reset on page reset
    this.resources = this.db.resources;
    this.resource = this.db.resource;
  }
  resources: any;
  resource: Observable<Resource>;

  getResource(resourceId){
    this.db.getResource(resourceId);
    this.resource = this.db.resource;
  }
  deleteResource(resourceId){
    this.db.deleteResource(resourceId);
  }
  addResource(name, note, group, schedulingDepend){
    this.db.addResource(name, note, group, schedulingDepend);

  }
}
