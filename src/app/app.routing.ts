import {Routes, RouterModule} from '@angular/router';

import {ScheduleComponent} from './schedule/schedule.component';
import {ResourcesComponent} from './resources/resources.component';
import {ProjectDetailComponent} from './projects/project-detail/project-detail.component';
// import {ScheduleComponent} from './schedule/schedule.component';

const appRoutes:Routes = [
    {path: 'schedule', component: ScheduleComponent},
    {path: '', component: ScheduleComponent},
    {path: 'resources', component: ResourcesComponent},
    {path: 'projects', component: ProjectDetailComponent}
];

export const routing = RouterModule.forRoot(appRoutes);
