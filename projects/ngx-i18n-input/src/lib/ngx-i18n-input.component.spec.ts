import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxI18nInputComponent } from './ngx-i18n-input.component';

describe('NgxI18nInputComponent', () => {
  let component: NgxI18nInputComponent;
  let fixture: ComponentFixture<NgxI18nInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxI18nInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxI18nInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
