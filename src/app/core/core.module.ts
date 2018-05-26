import { NgModule } from '@angular/core';
import { SetHttpContentTypeInterceptorService } from './set-http-content-type-interceptor.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

@NgModule({
  imports: [
  ],
  exports: [
  ],
  declarations: [],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: SetHttpContentTypeInterceptorService, multi: true}
  ]
})
export class CoreModule { }
