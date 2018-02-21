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
    this.db.ngOnInit();
    this.resources = this.db.resources;
    this.resource = this.db.resource;
  }
  resources: any;
  resource: Observable<Resource>;

  getPost(resourceId){
    this.db.getPost(resourceId);
    //this.resource = this.db.resourceDoc.valueChanges(); //updates resource info when resource is clicked, necessary because this isn't fed back from getPost() in db service
    this.resource = this.db.resource;
  }
  deletePost(resourceId){
    this.db.deletePost(resourceId);
  }
  addPost(name, note){
    this.db.addPost(name, note);

  }
}
