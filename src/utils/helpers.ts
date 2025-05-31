import { permissions, PROJECT_KEY } from '~constants/constants';
import { PermissionLevel } from '~types/types';

export const generatePermissions = (
  level: PermissionLevel = PermissionLevel.GUEST,
) => {
  return Object.values(permissions[level])
    .map((permission) => `${permission}:${PROJECT_KEY}`)
    .join(' ');
};

export function normalizeErrorMessage(message: string): string {
  const parts = message.split(':');

  if (parts.length < 3) return message;

  const prefix = parts[0].trim();
  const field = parts[1].trim().toLowerCase();
  const description = parts.slice(2).join(':').trim();

  return `${prefix}: ${field} ${description.charAt(0).toLowerCase()}${description.slice(1)}`;
}

export function textToUpperCase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

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
