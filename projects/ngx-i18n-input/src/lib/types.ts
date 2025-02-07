
export type Lang = string;
export type Langs = Lang[];

export interface NgxI18nInputConfig {
  availableLangs: Langs;
}

export const NGX_I18N_INPUT_DEFAULT_CONFIGS: NgxI18nInputConfig = {
  availableLangs: ["en"]
};