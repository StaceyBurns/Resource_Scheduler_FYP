import { Component, OnInit, Input} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Group} from '../../shared/interfaces/interfaces';
import {GroupId} from '../../shared/interfaces/interfaces';
import {DatabaseService} from '../../shared/database/database.service';
import 'rxjs/add/operator/map';
import {Resource} from '../../shared/interfaces/interfaces';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent implements OnInit {
  

  constructor(private db: DatabaseService) { } 

  ngOnInit() {
    this.resources = this.db.resources;
    this.name = this.group['name'];
    console.log('group');
    console.log(this.group['name']);
    console.log('init')
  }
  ngOnChanges(){
 
  }
  resources: any;
  name:string;
  groups: any;
  @Input() group:Observable<Group>;
}
