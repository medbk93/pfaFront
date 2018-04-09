import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from '../shared/material.module';
import {FormsModule, ReactiveFormsModule,} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TestAppRoutingModule } from './test-app-routing.module';
import { ProfAvailabilityComponent } from './teachers/prof-availability.component';
import { TestAppComponent } from './test-app.component';
import {TeacherService} from './teachers/services/teacher.service';
import {HttpClientModule} from '@angular/common/http';
import {ChreneauService} from './teachers/services/chreneau.service';
import {SessionService} from './teachers/services/session.service';
import {TestsComponent} from './tests/tests.component';
import {TestService} from './tests/services/test.service';
import {MatSortModule} from '@angular/material';
import {LocalService} from './tests/services/local.service';

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
  providers: [TeacherService, ChreneauService, SessionService, TestService, LocalService],
  declarations: [ProfAvailabilityComponent, TestAppComponent, TestsComponent]
})
export class TestAppModule { }
