import { Lang } from "./types";

export function ngxI18nDefaultFormatOutput(formValue: Record<Lang, string | null | number>): Record<Lang, string | null> {
  const out: Record<Lang, string | null> = {};

  Object.keys(formValue).forEach((lang: Lang) => {
    const value: number | string | null = formValue[lang];

    if (typeof value === "number") {
      out[lang] = value.toString();
    } else {
      out[lang] = value;
    }
  });

  return out;
}