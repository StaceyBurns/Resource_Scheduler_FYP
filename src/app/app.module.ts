import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { AppComponent } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import {FormsModule} from '@angular/forms';

import { ResourceListComponent } from './resources/resource-list/resource-list.component';
import { ResourcesComponent } from './resources/resources.component';
import { ResourceItemComponent } from './resources/resource-item/resource-item.component';
import { ResourceDetailComponent } from './resources/resource-detail/resource-detail.component';
import { ResourceEditComponent } from './resources/resource-edit/resource-edit.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { ProjectItemComponent } from './projects/project-item/project-item.component';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
import { ProjectEditComponent } from './projects/project-edit/project-edit.component';
import { HeaderComponent } from './header/header.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { ScheduleComponent } from './schedule/schedule.component';


import {AccordionModule} from 'primeng/accordion';
import {MenuItem} from 'primeng/api';  
import { MomentModule } from 'angular2-moment';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarRowComponent } from './calendar/calendar-row/calendar-row.component';
import { DatabaseService } from './shared/database/database.service';

 
var firebaseConfig = {
  apiKey: "AIzaSyD-mgAQdIx5NYBpWgXyfnV4caztBgS4ylQ",
  authDomain: "leash-prototype.firebaseapp.com",
  databaseURL: "https://leash-prototype.firebaseio.com",
  projectId: "leash-prototype",
  storageBucket: "leash-prototype.appspot.com",
  messagingSenderId: "78535726772"
};


@NgModule({
  declarations: [
    AppComponent,
    ResourceListComponent,
    ResourceItemComponent,
    ResourceDetailComponent,
    ResourceEditComponent,
    ProjectListComponent,
    ProjectItemComponent,
    ProjectDetailComponent,
    ProjectEditComponent,
    ResourcesComponent,
    HeaderComponent,
    DropdownDirective,
    ScheduleComponent,
    CalendarComponent,
    CalendarRowComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    MomentModule
  ],
  providers: [DatabaseService],
  bootstrap: [AppComponent],
})
export class AppModule { }



