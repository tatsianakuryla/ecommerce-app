import { permissions, PROJECT_KEY } from '~constants/constants';
import { Locale, LocalizedString, PermissionLevel } from '~types/types';
import Toastify from 'toastify-js';

export const generatePermissions = (
  level: PermissionLevel = PermissionLevel.GUEST,
) => {
  return Object.values(permissions[level])
    .map((permission) => `${permission}:${PROJECT_KEY}`)
    .join(' ');
};

export const normalizeErrorMessage = (message: string): string => {
  const parts = message.split(':');

  if (parts.length < 3) return message;

  const prefix = parts[0].trim();
  const field = parts[1].trim().toLowerCase();
  const description = parts.slice(2).join(':').trim();

  return `${prefix}: ${field} ${description.charAt(0).toLowerCase()}${description.slice(1)}`;
};

export const formatPrice = (
  price: number,
  currency: string,
  locale: string,
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(price / 100);
};

export const getAutocompleteValue = (name: string): string => {
  const map: Record<string, string> = {
    firstName: 'given-name',
    lastName: 'family-name',
    email: 'email',
    password: 'current-password',
    newPassword: 'new-password',
    phone: 'tel',
  };

  return map[name] ?? 'off';
};

const DEFAULT_LOCALE: Locale = 'en-US';

export function getLocalizedString(localized: LocalizedString): string {
  if (localized[DEFAULT_LOCALE]) {
    return localized[DEFAULT_LOCALE];
  }

  const locales: Locale[] = ['en-US', 'de-DE', 'en-GB'];
  const firstKey = locales.find((key) => localized[key]) || locales[0];
  return localized[firstKey] || '';
}

export function showError(message: string) {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: 'top',
    position: 'right',
    style: { background: '#E53E3E', color: '#fff' },
  }).showToast();
}

export function showInfo(message: string) {
  Toastify({
    text: message,
    duration: 2500,
    close: false,
    gravity: 'top',
    position: 'right',
    style: { background: '#319795', color: '#fff' },
  }).showToast();
}
