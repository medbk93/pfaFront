import { NgModule } from '@angular/core';
import {MaterialModule} from '../shared/material.module';
import { RouterModule } from '@angular/router';
import {FormsModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  imports: [
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    RouterModule
  ],
  exports: [
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    SidenavComponent,
    ToolbarComponent,
  ],
  declarations: [ SidenavComponent, ToolbarComponent]
})
export class CommonModule { }
