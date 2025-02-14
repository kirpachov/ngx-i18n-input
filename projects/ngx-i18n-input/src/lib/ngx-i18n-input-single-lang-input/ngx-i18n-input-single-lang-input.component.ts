import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject, Injector, Input, OnInit, TemplateRef, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { generateUid, Lang, NGX_I18N_INPUT_CONFIG, NGX_I18N_INPUT_CONTEXT, NGX_I18N_INPUT_DEFAULT_CONFIGS, NgxI18nInputConfig, NgxI18nInputContext } from '../types';

@Component({
  selector: 'lib-ngx-i18n-input-single-lang-input',
  templateUrl: './ngx-i18n-input-single-lang-input.component.html',
  styleUrls: [
    "./ngx-i18n-input-single-lang-input.component.scss",
    "../tw.scss"
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxI18nInputSingleLangInputComponent),
      multi: true
    }
  ]
})
export class NgxI18nInputSingleLangInputComponent<T> implements AfterViewInit, ControlValueAccessor {

  /*************************************** Dependencies ***************************************/
  private readonly cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly injector: Injector = inject(Injector);

  /*************************************** Instance variables ***************************************/
  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true }) container?: ViewContainerRef;

  readonly control = new FormControl<T | null>(null);

  /*************************************** Inputs and configs ***************************************/

  @Input() inputId: string = generateUid();

  @Input() configs: NgxI18nInputConfig = { ...NGX_I18N_INPUT_DEFAULT_CONFIGS };

  @Input() lang: Lang | null = null;

  /*************************************** Angular Lifecycle hoooks ***************************************/

  ngAfterViewInit(): void {
    this.renderComponent();
  }

  writeValue(obj: any): void {
    this.control.setValue(obj, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.control.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.control.valueChanges.subscribe(fn);
  }

  setDisabledState?(isDisabled: boolean): void {
    this.control[isDisabled ? 'disable' : 'enable']();
  }

  /*************************************** Public methods ***************************************/

  renderComponent(): void {
    if (!this.configs.defaultInputComponent) return; // No component to render.
    if (this.configs.inputTemplate) return; // will render inputTemplate.

    if (!this.container) {
      console.error(`Container not found for ${this.configs.defaultInputComponent.name}`);
      return;
    }

    if (!this.lang) {
      console.error(`invalid lang`);
      return;
    }

    this.container.clear();

    const context: NgxI18nInputContext = {
      configs: this.configs,
      control: this.control,
      lang: this.lang
    };

    const injector = Injector.create({
      providers: [
        {
          provide: NGX_I18N_INPUT_CONTEXT,
          useValue: context
        }
      ],
      parent: this.injector
    });

    const componentRef = this.container.createComponent(this.configs.defaultInputComponent, { injector });

    componentRef.changeDetectorRef.detectChanges();
  }

  inputTouched(): void {
    this.control.markAsTouched();
    this.control.updateValueAndValidity();
  }

  detectChanges(): void {
    this.cd.detectChanges();
  }
}
