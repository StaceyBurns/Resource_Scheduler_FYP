import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../../shared/database/database.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Resource} from '../../shared/interfaces/interfaces';
import {ResourceId} from '../../shared/interfaces/interfaces';

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
  }
  resources: any;
  resource: Observable<Resource>;

  getPost(resourceId){
    this.db.getPost(resourceId);
    this.resource = this.db.resource;
  }
  deletePost(resourceId){
    this.db.deletePost(resourceId);
  }
  addPost(name, note){
    this.db.addPost(name, note);

  }


  

}