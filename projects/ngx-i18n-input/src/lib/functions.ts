import { Lang } from "./types";

export function ngxI18nDefaultFormatOutput<T>(formValue: Record<Lang, T | null>): Record<Lang, T | null> {
  return formValue;
}