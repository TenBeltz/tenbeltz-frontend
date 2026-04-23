import { es } from './es';
import { en } from './en';

export const languages = {
  es: 'Español',
  en: 'English',
};

export const defaultLang = 'es';

export const ui = {
  es,
  en,
} as const;

export type Lang = keyof typeof ui;
