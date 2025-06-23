import { v4 } from 'uuid';
import { isStoredToken } from '~utils/typeguards.ts';

const ID_KEY = 'ct_anonymous_id';
const TOKEN_KEY = 'ct_anonymous_token';

export const getAnonymousId = (): string => {
  let id = localStorage.getItem(ID_KEY);
  if (!id) {
    id = v4();
    localStorage.setItem(ID_KEY, id);
  }
  return id;
};

export const getCachedToken = (): string | null => {
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  const parsed: unknown = JSON.parse(raw);
  if (!isStoredToken(parsed)) return null;
  return parsed.expiresAt > Date.now() ? parsed.token : null;
};

export const cacheToken = (token: string, expiresIn: number): void => {
  localStorage.setItem(
    TOKEN_KEY,
    JSON.stringify({ token, expiresAt: Date.now() + (expiresIn - 60) * 1000 }),
  );
};

export const clearAnonData = (): void => {
  localStorage.removeItem(ID_KEY);
  localStorage.removeItem(TOKEN_KEY);
};
