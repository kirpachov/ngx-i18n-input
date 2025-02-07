import { ChangeDetectionStrategy, Component, forwardRef, inject, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Lang } from './types';
import { ngxI18nDefaultFormatOutput } from './functions';
import { map, Observable } from 'rxjs';
import { NgxI18nInputService } from './ngx-i18n-input.service';

@Component({
  selector: 'ngx-i18n-input',
  templateUrl: './ngx-i18n-input.component.html',
  styleUrls: ['./ngx-i18n-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxI18nInputComponent),
      multi: true
    }
  ]
})
export class NgxI18nInputComponent<T> implements OnInit, ControlValueAccessor {

  private readonly service: NgxI18nInputService = inject(NgxI18nInputService);

  configs = this.service.configs$.value;

  readonly forms: FormGroup = new FormGroup({});

  @Input() formatOutput: (value: Record<Lang, T | null>) => Record<Lang, T | null> = ngxI18nDefaultFormatOutput;

  @Output() valueChanges: Observable<Record<Lang, T | null>> = this.forms.valueChanges.pipe(map(this.formatOutput));

  /**
   * TODO when touched, emit an event
   */
  @Output() touchedChanges: Observable<void> = new Observable<void>();

  /**
   * Customize input template. Suggested but not required.
   * Usage:
   * ```html
   *  <ng-template #titleTemplate let-all>
   *   <input [formControl]="all.control">
   *  </ng-template>
   *
   *  <ngx-i18n-input [inputTemplate]="titleTemplate" formControlName="title">
   * ```
   */
  @Input() inputTemplate: TemplateRef<unknown> | null = null;

  /**
   * Customize language name template.
   * Example with both input and label templates:
   */
  @Input() labelTemplate: TemplateRef<unknown> | null = null;

  @Input() layout: "tabs" | "vertical" = "vertical";

  readonly availableLangs$ = this.service.availableLangs$;

  ngOnInit(): void {
    this.availableLangs$.subscribe({next: (langs: Lang[]) => {
      langs.forEach((lang: Lang) => {
        this.forms.addControl(lang, new FormControl(null));
      });
    }});

    this.service.configs$.subscribe({next: (configs) => this.configs = configs});
  }

  writeValue(value: unknown): void {
    if (value === null || value === undefined) value = {};

    if (typeof value !== 'object') {
      console.warn('NgxI18nInputComponent: value must be an object or null. Will reset input. got ', value);
      value = {};
    }

    this.forms.patchValue(value as Record<string, unknown>, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.valueChanges.subscribe({
      next: (value: Record<Lang, T | null>) => fn(value)
    });
  }

  registerOnTouched(fn: any): void {
    this.registerOnChange(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.forms[isDisabled ? 'disable' : 'enable']();
  }

}
