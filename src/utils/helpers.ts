import { permissions } from '~constants/constants';
import { PermissionLevel } from '~types/types';

const clientName = import.meta.env.VITE_API_CLIENT_NAME;

export const generatePermissions = (
  level: PermissionLevel = PermissionLevel.USER,
) => {
  return Object.values(permissions[level])
    .map((permission) => `${permission}:${clientName}`)
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
