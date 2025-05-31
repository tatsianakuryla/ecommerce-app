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
  if (!NAME_REGEX.test(name)) return 'First name must be latin letters only.';
  return '';
}

export function validateLastName(name: string): string {
  if (!name.trim()) return 'Last name is required.';
  if (!NAME_REGEX.test(name)) return 'Last name must be latin letters only.';
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
    return 'Password must be at least 8 chars from Latin alphabet, include upper, lower, number.';
  return '';
}

export function validateConfirmPassword(pw: string, cpw: string): string {
  if (pw !== cpw) return 'Passwords must match.';
  return '';
}

export function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) {
    return digits;
  } else if (digits.length <= 6) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  } else {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
  }
}

export function validateDateOfBirth(dateOfBirth: string): string {
  const today = new Date();

  if (!dateOfBirth.trim()) {
    return 'Date of birth is required.';
  }

  if (dateOfBirth.length < 10) {
    return 'Please enter your full date of birth (YYYY-MM-DD).';
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
    return 'Invalid date format.';
  }

  const [yyyyString, mmString, ddString] = dateOfBirth.split('-');
  const year = parseInt(yyyyString, 10);
  const month = parseInt(mmString, 10);
  const day = parseInt(ddString, 10);

  if (isNaN(year) || year > today.getFullYear() || year < 1900) {
    return 'Invalid year.';
  }

  if (isNaN(month) || month < 1 || month > 12) {
    return 'Invalid month.';
  }

  const maxDay = new Date(year, month, 0).getDate();
  if (isNaN(day) || day < 1 || day > maxDay) {
    return 'Invalid day for month.';
  }

  let age = today.getFullYear() - year;
  const monthDiff = today.getMonth() + 1 - month;
  const dayDiff = today.getDate() - day;
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  if (age < 13) {
    return 'You must be at least 13 years old.';
  }

  return '';
}

export function validateStreet(street: string): string {
  if (!street.trim()) return 'Street is required.';
  return '';
}

export function validateCity(city: string): string {
  if (!city.trim()) return 'City is required.';
  if (!CITY_REGEX.test(city)) return 'City must be latin letters only.';
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
