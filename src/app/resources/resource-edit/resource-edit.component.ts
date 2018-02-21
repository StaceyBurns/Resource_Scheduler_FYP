import { Component, OnInit, Input,  Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {DatabaseService} from '../../shared/database/database.service';
import {Resource} from '../../shared/interfaces/interfaces';
import {ResourceId} from '../../shared/interfaces/interfaces';

@Component({
  selector: 'app-resource-edit',
  templateUrl: './resource-edit.component.html',
  styleUrls: ['./resource-edit.component.css']
})
export class ResourceEditComponent implements OnInit {


  constructor(private db: DatabaseService) { 
    this.resources = this.db.resources;
    this.resource = this.db.resource;
  }

  ngOnInit() {
  }

  resources: any;
  @Input() resource:Observable<Resource>;

  saveEdit(name, note){
    console.log('Name: '+name +' Note ' +note);
    this.db.editResource(name, note);
  }

}

