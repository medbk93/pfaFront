import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from '../shared/material.module';
import {FormsModule, ReactiveFormsModule,} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TestAppRoutingModule } from './test-app-routing.module';
import { ProfAvailabilityComponent } from './availability/prof-availability.component';
import { TestAppComponent } from './test-app.component';
import {TeacherService} from './availability/services/teacher.service';
import {HttpClientModule} from '@angular/common/http';
import {ChreneauService} from './availability/services/chreneau.service';
import {SessionService} from './availability/services/session.service';
import {TestsComponent} from './tests/tests.component';
import {TestService} from './tests/services/test.service';
import {MatSortModule} from '@angular/material';
import {LocalService} from './tests/services/local.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import {UpdateSupervisorDialogComponent} from './supervisor/update-supervisor-dialog/update-supervisor-dialog.component';
import { SupervisorComponent } from './supervisor/supervisor/supervisor.component';
import { SubjectComponent } from './subject/subject.component';
import {SubjectService} from './services/subject.service';
import { ClasseComponent } from './classe/classe.component';
import {ClasseService} from './services/classe.service';
import { ScheduleComponent } from './supervisor/schedule/schedule.component';
import { ClasseEditComponent } from './classe/classe-edit/classe-edit.component';
import {SpecialityService} from './services/speciality.service';
import {DepartmentService} from './services/department.service';
import {LevelService} from './services/level.service';
import {LevelSpecialityService} from "./services/level-speciality.service";

@NgModule({
  imports: [
    CommonModule,
    TestAppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    MatSortModule
  ],
  exports: [
    CommonModule,
  ],
  providers: [
    TeacherService,
    ChreneauService,
    SessionService,
    TestService,
    LocalService,
    SubjectService,
    ClasseService,
    SpecialityService,
    DepartmentService,
    LevelService,
    LevelSpecialityService
  ],
  declarations: [
    ProfAvailabilityComponent,
    TestAppComponent,
    TestsComponent,
    DashboardComponent,
    UpdateSupervisorDialogComponent,
    SupervisorComponent,
    SubjectComponent,
    ClasseComponent,
    ScheduleComponent,
    ClasseEditComponent
  ],
  entryComponents: [UpdateSupervisorDialogComponent, ClasseEditComponent]
})
export class TestAppModule { }
