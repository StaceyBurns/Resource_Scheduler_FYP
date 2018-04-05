import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { AppComponent } from './app.component';
import { ReactiveFormsModule} from "@angular/forms";
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome'

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';


import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import { DatabaseService } from './shared/database/database.service';
import { HeaderComponent } from './header/header.component';

import { ScheduleComponent } from './schedule/schedule.component';
import { ResourcesComponent } from './resources/resources.component';
import { ResourceDetailComponent } from './resources/resource-detail/resource-detail.component';
import { ResourceEditComponent } from './resources/resource-edit/resource-edit.component';
import { ResourceAddComponent } from './resources/resource-add/resource-add.component';
import { GroupsComponent } from './groups/groups.component';
import { GroupAddComponent } from './groups/group-add/group-add.component';
import { GroupEditComponent } from './groups/group-edit/group-edit.component';
import { GroupDetailComponent } from './groups/group-detail/group-detail.component';

import { DropdownDirective } from './shared/dropdown.directive';



import { MomentModule } from 'angular2-moment';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarRowComponent } from './calendar/calendar-row/calendar-row.component';
import { CalendarOverviewComponent } from './calendar/calendar-overview/calendar-overview.component';
import { CalendarModule} from "ap-angular2-fullcalendar";


import { routing } from './app.routing';


import { CoreModule } from './core/core.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthService } from './core/auth.service';
import { AuthGuard } from './core/auth.guard';
import { LoginPageComponent } from './login/login-page/login-page.component';
import { RegisterPageComponent } from './login/register-page/register-page.component';
import { RegisterCompanyComponent } from './login/register-page/register-company/register-company.component';
import { NotificationMessageComponent } from './notification-message/notification-message.component';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatInputModule} from '@angular/material';




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
    ScheduleComponent,
    ResourceDetailComponent,
    ResourceEditComponent,
    ResourcesComponent,
    HeaderComponent,
    DropdownDirective,
    CalendarComponent,
    CalendarRowComponent,
    ResourceAddComponent,
    CalendarOverviewComponent,
    UserProfileComponent,
    LoginPageComponent,
    RegisterPageComponent,
    NotificationMessageComponent,
    RegisterCompanyComponent,
    GroupsComponent,
    GroupAddComponent,
    GroupEditComponent,
    GroupDetailComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    CoreModule,
    Angular2FontawesomeModule,
    FormsModule,
    MomentModule, 
    CalendarModule,
    routing,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    MatButtonModule, 
    MatCheckboxModule, 
    MatDatepickerModule, 
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule
  ],
  providers: [DatabaseService, AuthService, AuthGuard, CalendarOverviewComponent, CalendarComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }



