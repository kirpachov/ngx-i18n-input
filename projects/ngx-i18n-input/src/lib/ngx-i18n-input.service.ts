import { inject, Injectable, InjectFlags } from '@angular/core';
import { NGX_I18N_INPUT_CONFIG, NGX_I18N_INPUT_DEFAULT_CONFIGS, NgxI18nInputConfig } from './types';
import { BehaviorSubject, Observable } from 'rxjs';
import { COUNTRY_ISO_CODES } from './country-iso-code';

@Injectable({
  providedIn: 'root'
})
export class NgxI18nInputService {
  private readonly providedConfigs: NgxI18nInputConfig | null = inject(NGX_I18N_INPUT_CONFIG, InjectFlags.Optional);
  readonly configs$: BehaviorSubject<NgxI18nInputConfig> = new BehaviorSubject(
    {...(this.providedConfigs || NGX_I18N_INPUT_DEFAULT_CONFIGS)}
  );

  readonly availableLangs$: BehaviorSubject<string[]> = new BehaviorSubject(this.configs$.value.availableLangs);

  constructor(){
    this.configs$.subscribe((v: NgxI18nInputConfig) => {
      this.availableLangs$.next(v.availableLangs);
    });
  }

  setAvailableLangs(langs: string[]): void {
    // langs = langs.filter((lang) => this.isLang(lang));

    if (langs.length === 0) langs = NGX_I18N_INPUT_DEFAULT_CONFIGS.availableLangs;

    const v = this.configs$.value;
    v.availableLangs = langs;
    this.configs$.next(v);
  }

  getAvailableLangs(): string[] {
    return this.availableLangs$.value;
  }

  // isLang(lang: unknown): boolean {
  //   return (
  //     typeof lang === "string" &&
  //     lang.length > 0 &&
  //     ([...COUNTRY_ISO_CODES] as string[]).includes(lang.toUpperCase())
  //   );
  // }
  
}
