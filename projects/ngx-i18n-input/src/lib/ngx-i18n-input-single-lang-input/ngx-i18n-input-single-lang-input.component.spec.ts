import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxI18nInputSingleLangInputComponent } from './ngx-i18n-input-single-lang-input.component';

describe('NgxI18nInputSingleLangInputComponent', () => {
  let component: NgxI18nInputSingleLangInputComponent;
  let fixture: ComponentFixture<NgxI18nInputSingleLangInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxI18nInputSingleLangInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxI18nInputSingleLangInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
