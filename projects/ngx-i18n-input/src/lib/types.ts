import { InjectionToken } from "@angular/core";
import { LANGUAGE_DETAILS } from "./country-iso-code";

export type Lang = string;
export type Langs = Lang[];

export interface NgxI18nInputConfig {
  availableLangs: Langs;
  stringifyLang: (lang: string) => string;
}

export const NGX_I18N_INPUT_DEFAULT_CONFIGS: NgxI18nInputConfig = {
  availableLangs: ["en"],
  stringifyLang: (lang: string) => {
    console.debug("default stringifyLang", {lang});
    return LANGUAGE_DETAILS[lang]?.i18nName || lang
  }
};

// TODO partial ??
export const NGX_I18N_INPUT_CONFIG = new InjectionToken<NgxI18nInputConfig>('NGX_I18N_INPUT_CONFIG');