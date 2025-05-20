import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
const NAME_REGEX = /^[A-Za-z]+$/;
const CITY_REGEX = /^[A-Za-z\s]+$/;
const US_POSTAL = /^\d{5}$/;
const CA_POSTAL = /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/;

export function validateFirstName(name: string): string {
  if (!name.trim()) return 'First name is required.';
  if (!NAME_REGEX.test(name)) return 'First name must be letters only.';
  return '';
}

export function validateLastName(name: string): string {
  if (!name.trim()) return 'Last name is required.';
  if (!NAME_REGEX.test(name)) return 'Last name must be letters only.';
  return '';
}

export function validateEmail(email: string): string {
  if (!email.trim()) return 'Email is required.';
  if (!EMAIL_REGEX.test(email)) return 'Invalid email format.';
  return '';
}

export function validatePassword(pw: string): string {
  if (!pw) return 'Password is required.';
  if (!PASSWORD_REGEX.test(pw))
    return 'Password must be at least 8 chars, include upper, lower, number.';
  return '';
}

export function validateConfirmPassword(pw: string, cpw: string): string {
  if (pw !== cpw) return 'Passwords must match.';
  return '';
}

export function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 2) {
    return digits;
  } else if (digits.length <= 4) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  } else {
    return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)}`;
  }
}

export function validateDateOfBirth(dob: string): string {
  if (!dob.trim()) return 'Date of birth is required.';

  if (dob.length >= 2) {
    const dayStr = dob.slice(0, 2);
    if (!/^\d{2}$/.test(dayStr)) return 'Invalid day format.';
    const day = Number(dayStr);
    if (day < 1 || day > 31) return 'Invalid day.';
  }

  if (dob.length >= 5) {
    const monthStr = dob.slice(3, 5);
    if (!/^\d{2}$/.test(monthStr)) return 'Invalid month format.';
    const month = Number(monthStr);
    if (month < 1 || month > 12) return 'Invalid month.';
  }

  if (dob.length >= 10) {
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(dob)) return 'Invalid date format.';
    const [dd, mm, yyyy] = dob.split('.');
    const day = Number(dd);
    const month = Number(mm);
    const year = Number(yyyy);
    const currentYear = new Date().getFullYear();
    if (year > currentYear) return 'Invalid year.';
    const maxDay = new Date(year, month, 0).getDate();
    if (day > maxDay) return 'Invalid day for month.';
    const today = new Date();
    let age = today.getFullYear() - year;
    const m = today.getMonth() - (month - 1);
    if (m < 0 || (m === 0 && today.getDate() < day)) age--;
    if (age < 13) return 'You must be at least 13 years old.';
  }

  return '';
}

export function validateStreet(street: string): string {
  if (!street.trim()) return 'Street is required.';
  return '';
}

export function validateCity(city: string): string {
  if (!city.trim()) return 'City is required.';
  if (!CITY_REGEX.test(city)) return 'City must be letters only.';
  return '';
}

const COUNTRY_CODES = Object.keys(countries.getNames('en'));

export function validateCountry(countryCode: string): string {
  if (!countryCode.trim()) return 'Country is required.';
  if (!COUNTRY_CODES.includes(countryCode)) return 'Select a valid country.';
  return '';
}

export function validatePostalCode(code: string, country: string): string {
  if (!code.trim()) return 'Postal code is required.';
  if (country === 'United States' && !US_POSTAL.test(code))
    return 'US postal code must be 5 digits.';
  if (country === 'Canada' && !CA_POSTAL.test(code))
    return 'Canadian postal code invalid.';
  return '';
}
