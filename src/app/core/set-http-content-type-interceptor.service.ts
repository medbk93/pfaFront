import { Injectable } from '@angular/core';
import {
  HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

@Injectable()
export class SetHttpContentTypeInterceptorService implements HttpInterceptor{

  constructor() { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedRequest = req.clone({
      responseType: 'text'
    });

    return next.handle(clonedRequest)
      .map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.Response) {
          return event.clone({
            body: JSON.parse(event.body),
          });
        }
      })
      .catch((error: HttpErrorResponse) => {
      console.log('error');
        const parsedError = Object.assign({}, error, { error: JSON.parse(error.error) });
        return Observable.throw(new HttpErrorResponse(parsedError));
      });
  }
}
