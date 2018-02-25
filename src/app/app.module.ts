import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { AppComponent } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { CoreModule } from './core/core.module';

import {FormsModule} from '@angular/forms';


import { ResourcesComponent } from './resources/resources.component';
import { ResourceDetailComponent } from './resources/resource-detail/resource-detail.component';
import { ResourceEditComponent } from './resources/resource-edit/resource-edit.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { ProjectItemComponent } from './projects/project-item/project-item.component';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
import { ProjectEditComponent } from './projects/project-edit/project-edit.component';
import { HeaderComponent } from './header/header.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { ScheduleComponent } from './schedule/schedule.component';


import { MomentModule } from 'angular2-moment';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarRowComponent } from './calendar/calendar-row/calendar-row.component';
import { DatabaseService } from './shared/database/database.service';

import {routing} from './app.routing';
import { ResourceAddComponent } from './resources/resource-add/resource-add.component';
import { CalendarOverviewComponent } from './calendar/calendar-overview/calendar-overview.component';

import {CalendarModule} from "ap-angular2-fullcalendar";
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthService } from './core/auth.service';
import { AuthGuard } from './core/auth.guard';
import { LoginPageComponent } from './login/login-page/login-page.component';
import { RegisterPageComponent } from './login/register-page/register-page.component';
import {ReactiveFormsModule} from "@angular/forms";
import { NotificationMessageComponent } from './notification-message/notification-message.component';

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
    CalendarRowComponent,
    ResourceAddComponent,
    CalendarOverviewComponent,
    CalendarComponent,
    UserProfileComponent,
    LoginPageComponent,
    RegisterPageComponent,
    NotificationMessageComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    CoreModule,
    FormsModule,
    MomentModule, 
    CalendarModule,
    routing,
    ReactiveFormsModule
  ],
  providers: [DatabaseService, AuthService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule { }



