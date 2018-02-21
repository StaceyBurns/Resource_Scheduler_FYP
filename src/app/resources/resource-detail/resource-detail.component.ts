import { Component, OnInit, Input} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Resource} from '../../shared/interfaces/interfaces';
import {ResourceId} from '../../shared/interfaces/interfaces';

@Component({
  selector: 'app-resource-detail',
  templateUrl: './resource-detail.component.html',
  styleUrls: ['./resource-detail.component.css']
})


export class ResourceDetailComponent implements OnInit {

  constructor(){
  }

  ngOnInit(){
  }

name:string;
  resources: any;
  @Input() resource:Observable<Resource>;
 
}
