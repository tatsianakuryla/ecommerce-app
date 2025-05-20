const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function validateEmail(email: string): string {
  if (!email) return 'Email is required.';
  if (email.trim() !== email)
    return 'Email must not contain leading or trailing spaces.';
  if (/[А-Яа-яЁё]/.test(email))
    return 'Email must not contain Cyrillic characters.';
  if (!EMAIL_REGEX.test(email)) return 'Invalid email format.';
  return '';
}

export function validatePassword(pw: string): string {
  if (!pw) return 'Password is required.';
  if (pw.trim() !== pw)
    return 'Password must not contain leading or trailing spaces.';
  if (/[А-Яа-яЁё]/.test(pw))
    return 'Password must not contain Cyrillic characters.';
  if (pw.length < 8) return 'Password must be at least 8 characters long.';
  if (!/[A-Z]/.test(pw))
    return 'Password must contain at least one uppercase letter.';
  if (!/[a-z]/.test(pw))
    return 'Password must contain at least one lowercase letter.';
  if (!/[0-9]/.test(pw)) return 'Password must contain at least one digit.';
  return '';
}
