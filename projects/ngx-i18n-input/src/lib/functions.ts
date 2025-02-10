import { Lang } from "./types";

export function ngxI18nDefaultFormatOutput<T>(formValue: Record<Lang, T | null>): Record<Lang, T | null> {
  return formValue;
}

export function generateUid(): string {
  return Math.random().toString(36).substring(2);
}