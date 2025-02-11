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
  @Input() set inputTemplate(template: TemplateRef<unknown> | null) {
    this.configs.inputTemplate = template;
  }

  get inputTemplate(){
    return this.configs.inputTemplate;
  }

  /**
   * Customize language name template.
   * Example with both input and label templates:
   */
  @Input() set labelTemplate(template: TemplateRef<unknown> | null) {
    this.configs.labelTemplate = template;
  }

  get labelTemplate(){
    return this.configs.labelTemplate;
  }

  /**
   * Customize label of the component.
   * When provided, will be used as string inside the template.
   */
  @Input() set label(label: string | Record<Lang, string> | null) {
    this.configs.label = label;
  }

  get label(){
    return this.configs.label;
  }

  /**
   * Customize layout of the component.
   * Available layouts:
   * - tabs
   * - vertical
   * Default: vertical
   */
  @Input() set layout(layout: NgxI18nInputLayout) {
    this.configs.layout = layout;
  }

  get layout(){
    return this.configs.layout;
  }

  /**
   * Autofocus input.
   * When boolean, will autofocus the first input.
   * When string, will autofocus the input with the given lang.
   */
  @Input() set autofocus(autofocus: boolean | string) {
    this.configs.autofocus = autofocus;
  }

  get autofocus(){
    return this.configs.autofocus;
  }

  /**
   * When true, labels won't be displayed.
   */
  @Input() set hideLabels(hideLabels: boolean) {
    this.configs.hideLabels = hideLabels;
  }

  get hideLabels(): boolean {
    return this.configs.hideLabels;
  }

  get availableLangs(): Lang[] {
    return this.configs.availableLangs;
  }

  @Input() set languages(langs: Lang[]) {
    this.configs.availableLangs = langs;
  }

  get languages(): Lang[] {
    return this.configs.availableLangs;
  }

  /**
   * When true, all inputs will be required.
   */
  @Input() set required(required: boolean | null | undefined) {
    this.configs.required = (required === true);
  }

  get required(): boolean {
    return this.configs.required;
  }

  /**
   * Adding validators to the input.
   */
  @Input() set validators(validators: ValidatorFn[] | null | undefined) {
    this.configs.validators = validators || [];
  }

  get validators(): ValidatorFn[] {
    return this.configs.validators || [];
  }

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

  getStrLabelFor(lang: Lang): string {
    if (typeof this.label === "string") return this.label;
    if (this.label && this.label[lang]) return this.label[lang];
  
    return lang;
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
