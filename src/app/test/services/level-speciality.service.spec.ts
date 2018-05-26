import { TestBed, inject } from '@angular/core/testing';

import { LevelSpecialityService } from './level-speciality.service';

describe('LevelSpecialityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LevelSpecialityService]
    });
  });

  it('should be created', inject([LevelSpecialityService], (service: LevelSpecialityService) => {
    expect(service).toBeTruthy();
  }));
});
