import { BrowserModule } from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { TestAppModule } from './test/test-app.module';
import { CommonModule } from './common/common.module';


import { AppComponent } from './app.component';

const routes: Routes = [
  { path: 'tests',
    loadChildren: './test/test-app.module#TestAppModule'},
  { path: '**', redirectTo: 'tests'}
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TestAppModule,
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
