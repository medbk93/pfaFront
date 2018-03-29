import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProfAvailabilityComponent} from './teachers/prof-availability.component';
import {TestAppComponent} from './test-app.component';
import {TestsComponent} from './tests/tests.component';

const routes: Routes = [
  { path: 'teachers', children: [
    { path: '', component: TestAppComponent},
    { path: 'availability/:id', component: ProfAvailabilityComponent},
  ]},
  { path: 'tests', children: [
    { path: '', component: TestsComponent},
  ]},
  { path: '**', redirectTo: 'tests'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestAppRoutingModule { }
