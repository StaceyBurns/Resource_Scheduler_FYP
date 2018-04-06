import {Routes, RouterModule} from '@angular/router'; //import angular router which has all functionality to handle routing

import {ScheduleComponent} from './schedule/schedule.component';
import {ResourcesComponent} from './resources/resources.component';
import {GroupsComponent} from './groups/groups.component';
import {AuthGuard} from'./core/auth.guard';
import {LoginPageComponent} from './login/login-page/login-page.component';
import {RegisterPageComponent} from './login/register-page/register-page.component';
import {UserProfileComponent} from './user-profile/user-profile.component'; //import all necessary components

const appRoutes:Routes = [
    {path: 'schedule', component: ScheduleComponent, canActivate: [AuthGuard]}, //Routes with 'canActivate: [AuthGuard]' can only be accessed when the user is logged in
    {path: '', component: ScheduleComponent, canActivate: [AuthGuard]}, //route to schedule page if route isn't matched, users who aren't logged in will be redirected to login by the schedule component
    {path: 'resources', component: ResourcesComponent, canActivate: [AuthGuard]},
    {path: 'groups', component: GroupsComponent, canActivate: [AuthGuard]},
    {path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard]},
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegisterPageComponent }
];

export const routing = RouterModule.forRoot(appRoutes);