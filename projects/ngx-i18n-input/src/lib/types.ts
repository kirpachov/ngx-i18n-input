import { InjectionToken, Provider, TemplateRef, Type } from "@angular/core";
import { LANGUAGE_DETAILS } from "./country-iso-code";
import { AbstractControl, FormControl, ValidatorFn } from "@angular/forms";

export type Lang = string;
export type Langs = Lang[];


export const NgxI18nInputLayouts = ["vertical", "tabs"] as const;
export type NgxI18nInputLayout = typeof NgxI18nInputLayouts[number];

export interface NgxI18nInputConfig {
  availableLangs: Langs;
  languageDetails: Record<Lang, { name: string }>;
  stringifyLang: (lang: string) => string;
  formatLabel: (lang: Lang, label: string | Record<Lang, string> | null) => string,
  layout: NgxI18nInputLayout,
  labelTemplate: TemplateRef<unknown> | null,
  inputTemplate: TemplateRef<unknown> | null,
  hideLabels: boolean,
  autofocus: boolean | string,
  required: boolean,
  label: string | Record<Lang, string> | null,
  validators: ValidatorFn[],
  defaultInputComponent: Type<any> | null | undefined,
  formatOutput: (formValue: Record<Lang, any | null>) => Record<Lang, any | null>
}

export const NGX_I18N_INPUT_DEFAULT_CONFIGS: NgxI18nInputConfig = {
  availableLangs: ["en"],
  languageDetails: LANGUAGE_DETAILS,
  stringifyLang: function(lang: Lang): string {
    return (this.languageDetails || LANGUAGE_DETAILS)[lang]?.name || lang;
  },
  formatLabel: function(lang: Lang, label: string | Record<Lang, string> | null): string {
    const labelStr: string = typeof label === "string" ? label : (label || {})[lang];

    if (!labelStr) return this.stringifyLang(lang);

    return labelStr + " (" + this.stringifyLang(lang) + ")";
  },
  layout: NgxI18nInputLayouts[0],
  labelTemplate: null,
  inputTemplate: null,
  hideLabels: false,
  autofocus: false,
  required: false,
  label: null,
  validators: [],
  defaultInputComponent: null,
  formatOutput: ngxI18nDefaultFormatOutput
};

// TODO partial ??
export const NGX_I18N_INPUT_CONFIG = new InjectionToken<NgxI18nInputConfig>('NGX_I18N_INPUT_CONFIG');

export function mergeNgxI18nConfigs(configs: Partial<NgxI18nInputConfig> | null | undefined): NgxI18nInputConfig {
  if (!configs) return NGX_I18N_INPUT_DEFAULT_CONFIGS;

  return {
    ...NGX_I18N_INPUT_DEFAULT_CONFIGS,
    ...configs
  }
}

export function provideNgxI18nConfigs(configs: Partial<NgxI18nInputConfig>): Provider {
  return {
    provide: NGX_I18N_INPUT_CONFIG,
    useValue: mergeNgxI18nConfigs(configs)
  }
}

export function ngxI18nDefaultFormatOutput<T>(formValue: Record<Lang, T | null>): Record<Lang, T | null> {
  return formValue;
}

export function generateUid(): string {
  return Math.random().toString(36).substring(2);
}

export interface NgxI18nInputContext {
  configs: NgxI18nInputConfig;
  control: FormControl<any>;
  lang: Lang;
  // writeValue: (value: any) => void
}

export const NGX_I18N_INPUT_CONTEXT = new InjectionToken<NgxI18nInputContext>('NGX_I18N_INPUT_CONTEXT');

export function isNgxI18nInputContext(v: unknown): v is NgxI18nInputContext {
  return typeof v === "object" && v !== null && "configs" in v && "control" in v;
}