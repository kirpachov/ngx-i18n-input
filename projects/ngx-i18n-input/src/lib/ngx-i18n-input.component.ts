import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Lang } from './types';
import { generateUid, ngxI18nDefaultFormatOutput } from './functions';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { NgxI18nInputService } from './ngx-i18n-input.service';

@Component({
  selector: 'ngx-i18n-input',
  templateUrl: './ngx-i18n-input.component.html',
  styleUrls: [
    './tw.scss',
    './ngx-i18n-input.component.scss',
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
export class NgxI18nInputComponent<T> implements OnInit, ControlValueAccessor {

  activeLang: Lang | null = null;

  private readonly cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly service: NgxI18nInputService = inject(NgxI18nInputService);

  @Input() uid: string = generateUid();

  configs = this.service.configs$.value;

  readonly forms: FormGroup = new FormGroup({});

  @Input() formatOutput: (value: Record<Lang, T | null>) => Record<Lang, T | null> = ngxI18nDefaultFormatOutput;

  @Output() valueChanges: Observable<Record<Lang, T | null>> = this.forms.valueChanges.pipe(map(this.formatOutput));

  /**
   * TODO when touched, emit an event
   */
  // @Output() touchedChanges: Observable<void> = new Observable<void>();

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

  /**
   * Customize layout of the component.
   * Available layouts:
   * - tabs
   * - vertical
   * Default: vertical
   */
  @Input() layout: "tabs" | "vertical" = "vertical";

  /**
   * Autofocus input.
   * When boolean, will autofocus the first input.
   * When string, will autofocus the input with the given lang.
   */
  @Input() autofocus: boolean | string = false;

  /**
   * When true, labels won't be displayed.
   */
  @Input() hideLabels: boolean = false;

  availableLangs$ = this.service.availableLangs$;

  @Input() set languages(langs: Lang[]) {
    this.availableLangs$ = new BehaviorSubject(langs);
  }

  ngOnInit(): void {
    this.availableLangs$.subscribe({next: (langs: Lang[]) => {
      langs.forEach((lang: Lang) => {
        if (!this.forms.get(lang)) this.forms.addControl(lang, new FormControl(null));
      });
    }});

    this.service.configs$.subscribe({next: (c) => this.configs = c});

    if (typeof this.autofocus === "string" && this.forms.get(this.autofocus)) {
      this.activeLang = this.autofocus;
    } else if (this.autofocus === true) {
      this.focusInput(this.availableLangs$.value[0]);
    }
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

  getId(lang: Lang): string {
    return `${this.uid}-${lang}`;
  }

  inputId(lang: Lang): string {
    return `input-${this.getId(lang)}`;
  }

  containerId(lang: Lang): string {
    return `container-${this.getId(lang)}`;
  }

  focusInput(lang: string): void {
    this.activeLang = lang;
    setTimeout(() => this.tryLocateAndFocusInput(lang));
    this.cd.detectChanges();
  }


  /**
   * This method will try to locate the input with the given lang and focus it.
   */
  private tryLocateAndFocusInput(lang: Lang): void {
    const done = () => this.cd.detectChanges();

    const input = document.getElementById(this.inputId(lang));
    if (input) {
      input.focus();
      return done();
    }

    const container = document.getElementById(this.containerId(lang));
    if (container) {
      const input = container.querySelector('input');
      if (input) {
        input.focus();
        return done();
      }
    }

    done();
  }
}
