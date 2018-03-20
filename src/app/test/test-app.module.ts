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

@NgModule({
  imports: [
    CommonModule,
    TestAppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule
  ],
  exports: [
    CommonModule,
  ],
  providers: [TeacherService, ChreneauService, SessionService],
  declarations: [ProfAvailabilityComponent, TestAppComponent]
})
export class TestAppModule { }
