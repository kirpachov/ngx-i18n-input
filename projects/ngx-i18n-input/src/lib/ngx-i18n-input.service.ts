import { Injectable } from '@angular/core';
import { NGX_I18N_INPUT_DEFAULT_CONFIGS, NgxI18nInputConfig } from './types';
import { BehaviorSubject, Observable } from 'rxjs';
import { COUNTRY_ISO_CODES } from './country-iso-code';

@Injectable({
  providedIn: 'root'
})
export class NgxI18nInputService {
  private configs: BehaviorSubject<NgxI18nInputConfig> = new BehaviorSubject({...NGX_I18N_INPUT_DEFAULT_CONFIGS});

  setAvailableLangs(langs: string[]): void {
    langs = langs.filter((lang) => this.isLang(lang));

    if (langs.length === 0) langs = NGX_I18N_INPUT_DEFAULT_CONFIGS.availableLangs;

    const v = this.configs.value;
    v.availableLangs = langs;
    this.configs.next(v);
  }

  getAvailableLangs(): string[] {
    return this.configs.value.availableLangs;
  }

  isLang(lang: unknown): boolean {
    return (
      typeof lang === "string" &&
      lang.length > 0 &&
      ([...COUNTRY_ISO_CODES] as string[]).includes(lang.toUpperCase())
    );
  }
  
}
