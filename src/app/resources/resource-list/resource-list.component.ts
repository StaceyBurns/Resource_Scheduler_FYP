import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {Resource} from '../resource.model';

@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.css']
})

export class ResourceListComponent implements OnInit {
  @Output() resourceWasSelected = new EventEmitter<Resource>();
  resources: Resource[] = [
    new Resource("Resource 1", "This is simply a test resource 1"),
     new Resource("Resource 2", "This is simply a test resource 2")
  ];

  constructor() { }

  ngOnInit() {
  }
  onResourceSelected(resource:Resource){
    this.resourceWasSelected.emit(resource);
  }

}
