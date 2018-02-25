import {Routes, RouterModule} from '@angular/router';

import {ScheduleComponent} from './schedule/schedule.component';
import {ResourcesComponent} from './resources/resources.component';
import {ProjectDetailComponent} from './projects/project-detail/project-detail.component';
import {AuthGuard} from'./core/auth.guard';
import {LoginPageComponent} from './login/login-page/login-page.component';
import {RegisterPageComponent} from './login/register-page/register-page.component';
// import {ScheduleComponent} from './schedule/schedule.component';

const appRoutes:Routes = [
    {path: 'schedule', component: ScheduleComponent, canActivate: [AuthGuard]},
    {path: '', component: ScheduleComponent, canActivate: [AuthGuard]},
    {path: 'resources', component: ResourcesComponent, canActivate: [AuthGuard]},
    {path: 'project', component: ProjectDetailComponent, canActivate: [AuthGuard]},
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegisterPageComponent }
];

export const routing = RouterModule.forRoot(appRoutes);
