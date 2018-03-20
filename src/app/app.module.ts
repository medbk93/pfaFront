import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
