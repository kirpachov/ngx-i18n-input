import { InjectionToken, Provider, TemplateRef } from "@angular/core";
import { LANGUAGE_DETAILS } from "./country-iso-code";

export type Lang = string;
export type Langs = Lang[];


export const NgxI18nInputLayouts = ["vertical", "tabs"] as const;
export type NgxI18nInputLayout = typeof NgxI18nInputLayouts[number];

export interface NgxI18nInputConfig {
  availableLangs: Langs;
  stringifyLang: (lang: string) => string;
  layout: NgxI18nInputLayout,
  labelTemplate: TemplateRef<unknown> | null,
  inputTemplate: TemplateRef<unknown> | null,
  hideLabels: boolean,
  autofocus: boolean,
  required: boolean,
}

export const NGX_I18N_INPUT_DEFAULT_CONFIGS: NgxI18nInputConfig = {
  availableLangs: ["en"],
  stringifyLang: (lang: string) => {
    return LANGUAGE_DETAILS[lang]?.i18nName || lang
  },
  layout: NgxI18nInputLayouts[0],
  labelTemplate: null,
  inputTemplate: null,
  hideLabels: false,
  autofocus: false,
  required: false
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