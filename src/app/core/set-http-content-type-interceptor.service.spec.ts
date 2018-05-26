import { TestBed, inject } from '@angular/core/testing';

import { SetHttpContentTypeInterceptorService } from './set-http-content-type-interceptor.service';

describe('SetHttpContentTypeInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SetHttpContentTypeInterceptorService]
    });
  });

  it('should be created', inject([SetHttpContentTypeInterceptorService], (service: SetHttpContentTypeInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
