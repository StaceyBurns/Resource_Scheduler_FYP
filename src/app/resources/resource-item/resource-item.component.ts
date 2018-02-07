import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {Resource} from '../resource.model';

@Component({
  selector: 'app-resource-item',
  templateUrl: './resource-item.component.html',
  styleUrls: ['./resource-item.component.css']
})
export class ResourceItemComponent implements OnInit {

  @Input() resource: Resource;
  @Output() resourceSelected = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {
  }

  onSelected(){
    this.resourceSelected.emit();

  }

}
