import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProfAvailabilityComponent} from './availability/prof-availability.component';
import {TestAppComponent} from './test-app.component';
import {TestsComponent} from './tests/tests.component';
import {SupervisorComponent} from './supervisor/supervisor/supervisor.component';
import {SubjectComponent} from './subject/subject.component';
import {ClasseComponent} from './classe/classe.component';
import {ScheduleComponent} from "./supervisor/schedule/schedule.component";
import {ClasseEditComponent} from "./classe/classe-edit/classe-edit.component";

const routes: Routes = [
  { path: 'teachers', children: [
    { path: '', component: TestAppComponent},
    { path: 'availability/:id', component: ProfAvailabilityComponent},
  ]},
  { path: 'tests', children: [
    { path: '', component: TestsComponent},
  ]},
  { path: 'subjects', children: [
    { path: '', component: SubjectComponent},
  ]},
  { path: 'classes', children: [
    { path: '', component: ClasseComponent}
  ]},
  { path: 'schedules', children: [
    { path: '', component: ScheduleComponent},
  ]},
  { path: 'supervisors', children: [
    { path: '', component: SupervisorComponent},
  ]},
  { path: '**', redirectTo: 'tests'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestAppRoutingModule { }
