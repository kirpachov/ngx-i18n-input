import { TestBed } from '@angular/core/testing';

import { NgxI18nInputService } from './ngx-i18n-input.service';

describe('NgxI18nInputService', () => {
  let service: NgxI18nInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxI18nInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
