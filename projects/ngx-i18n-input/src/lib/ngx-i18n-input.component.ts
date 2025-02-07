import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Lang } from './types';
import { ngxI18nDefaultFormatOutput } from './functions';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'ngx-i18n-input',
  template: `
    <p>
      ngx-i18n-input works!
    </p>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxI18nInputComponent),
      multi: true
    }
  ]
})
export class NgxI18nInputComponent implements OnInit, ControlValueAccessor {

  readonly forms: FormGroup = new FormGroup({});

  @Input() formatOutput: (value: Record<Lang, string | number | null>) => Record<Lang, string | null> = ngxI18nDefaultFormatOutput;

  @Output() valueChanges: Observable<Record<Lang, string | null>> = this.forms.valueChanges.pipe(map(this.formatOutput));

  /**
   * TODO when touched, emit an event
   */
  @Output() touchedChanges: Observable<void> = new Observable<void>();

  ngOnInit(): void {
    console.log("init");
  }

  writeValue(value: unknown): void {
    if (value === null || value === undefined) value = {};

    if (typeof value !== 'object') {
      console.error('NgxI18nInputComponent: value must be an object or null, got ', value);
      return;
    }

    const obj: Record<string | number, unknown> = value as Record<string | number, unknown>;

    Object.keys(obj).forEach((lang: string) => {
      const value: unknown = obj[lang];
      if (typeof value === 'string' || value === null || value === undefined || typeof value === "number") {
        if (this.forms.controls[lang]) this.forms.controls[lang].setValue(value);
        else this.forms.addControl(lang, new FormControl(value)); // ??
      } else {
        console.error(`NgxI18nInputComponent: value for language ${lang} must be a string or null, got `, value);
      }
    });
  }

  registerOnChange(fn: any): void {
    this.valueChanges.subscribe({
      next: (value: Record<Lang, string | null>) => fn(value)
    });
  }

  registerOnTouched(fn: any): void {
    this.touchedChanges.subscribe({
      next: () => fn()
    });
  }

  setDisabledState(isDisabled: boolean): void {
    console.log("disabledState");
    this.forms[isDisabled ? 'disable' : 'enable']();
  }

}
