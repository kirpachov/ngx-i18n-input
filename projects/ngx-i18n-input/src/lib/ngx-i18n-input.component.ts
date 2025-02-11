import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Inject, inject, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR, RequiredValidator, ValidatorFn } from '@angular/forms';
import { Lang, mergeNgxI18nConfigs, NGX_I18N_INPUT_CONFIG, NGX_I18N_INPUT_DEFAULT_CONFIGS, NgxI18nInputConfig, NgxI18nInputLayout, NgxI18nInputLayouts } from './types';
import { generateUid, ngxI18nDefaultFormatOutput } from './types';
import { BehaviorSubject, map, Observable, of } from 'rxjs';

@Component({
  selector: 'ngx-i18n-input',
  templateUrl: './ngx-i18n-input.component.html',
  styleUrls: [
    './tw.scss',
    './ngx-i18n-input.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxI18nInputComponent),
      multi: true
    }
  ]
})
export class NgxI18nInputComponent<T> implements OnInit, OnChanges, ControlValueAccessor {

  activeLang: Lang | null = null;

  private readonly cd: ChangeDetectorRef = inject(ChangeDetectorRef);

  @Input() uid: string = generateUid();

  readonly configs: NgxI18nInputConfig = mergeNgxI18nConfigs(inject(NGX_I18N_INPUT_CONFIG, {optional: true}) || NGX_I18N_INPUT_DEFAULT_CONFIGS);

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
  @Input() inputTemplate: TemplateRef<unknown> | null = this.configs.inputTemplate;

  /**
   * Customize language name template.
   * Example with both input and label templates:
   */
  @Input() labelTemplate: TemplateRef<unknown> | null = this.configs.labelTemplate;

  /**
   * Customize layout of the component.
   * Available layouts:
   * - tabs
   * - vertical
   * Default: vertical
   */
  @Input() layout: NgxI18nInputLayout = this.configs.layout;

  /**
   * Autofocus input.
   * When boolean, will autofocus the first input.
   * When string, will autofocus the input with the given lang.
   */
  @Input() autofocus: boolean | string = this.configs.autofocus;

  /**
   * When true, labels won't be displayed.
   */
  @Input() hideLabels: boolean = this.configs.hideLabels;

  availableLangs: string[] = [...this.configs.availableLangs];

  @Input() set languages(langs: Lang[]) {
    this.availableLangs = langs;
  }

  /**
   * When true, all inputs will be required.
   */
  @Input() required: boolean | null | undefined = this.configs.required;

  @Input() validators: ValidatorFn[] | null | undefined = [];

  private readonly elementRef: ElementRef = inject(ElementRef);

  /**
   * Since we're using shadow dom, we need to store a reference to it.
   * Hence, if you need to find an element, don't use document.getElementById, but this.myShadowRoot.getElementById.
   */
  private readonly myShadowRoot: ShadowRoot = this.elementRef.nativeElement.shadowRoot;

  validateFn(control: AbstractControl): { [key: string]: any } | null {
    const value: unknown = control.value;
    const acc: Record<string, any> = {};

    if (this.required === true) {
      if (
        value == null ||
        value == undefined ||
        ((typeof value === "string" || Array.isArray(value)) && value.length === 0) ||
        (typeof value === "object" && Object.keys(value as Record<string, unknown>).length === 0)
      ) {
        acc["required"] = true;
      }
    }

    this.validators?.forEach((validator: ValidatorFn) => {
      const result: Record<string, any> | null = validator(control);
      if (result) {
        Object.keys(result).forEach((key: string) => {
          acc[key] = result[key];
        });
      }
    });

    return Object.keys(acc).length > 0 ? acc : null;
  }

  ngOnInit(): void {

    this.availableLangs.forEach((lang: Lang) => {
      if (!this.forms.get(lang)) this.forms.addControl(lang, new FormControl(null, [
        this.validateFn.bind(this)
      ]));
    });

    // this.service.configs$.subscribe({next: (c) => this.configs = c});

    if (typeof this.autofocus === "string" && this.forms.get(this.autofocus)) {
      this.activeLang = this.autofocus;
    } else if (this.autofocus === true) {
      this.focusInput(this.availableLangs[0]);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      Object.values(this.forms.controls).forEach((control: AbstractControl) => control.updateValueAndValidity());
    });
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

  isActiveLang(lang: Lang): boolean {
    return this.activeLang === lang || (
      this.activeLang === null &&
      this.availableLangs &&
      lang === this.availableLangs[0]
    );
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

    const input = this.myShadowRoot.getElementById(this.inputId(lang));
    if (input) {
      input.focus();
      return done();
    }

    const container = this.myShadowRoot.getElementById(this.containerId(lang));
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
