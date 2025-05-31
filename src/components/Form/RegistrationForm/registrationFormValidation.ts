import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
const NAME_REGEX = /^[A-Za-z]+$/;
const CITY_REGEX = /^[A-Za-z\s]+$/;

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
  if (!NAME_REGEX.test(street)) return 'Last name must be latin letters only.';
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

const patternsMap: Record<string, RegExp | undefined> = {
  'United States': /^[0-9]{5}(?:-[0-9]{4})?$/,
  US: /^[0-9]{5}(?:-[0-9]{4})?$/,
  Canada: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
  CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
  'United Kingdom':
    /^(GIR\s?0AA|[A-Za-z]{1,2}\d{1,2}[A-Za-z]?\s*\d[A-Za-z]{2})$/,
  GB: /^(GIR\s?0AA|[A-Za-z]{1,2}\d{1,2}[A-Za-z]?\s*\d[A-Za-z]{2})$/,
  UK: /^(GIR\s?0AA|[A-Za-z]{1,2}\d{1,2}[A-Za-z]?\s*\d[A-Za-z]{2})$/,
  Germany: /^\d{5}$/,
  DE: /^\d{5}$/,
  Russia: /^\d{6}$/,
  RU: /^\d{6}$/,
  France: /^\d{5}$/,
  FR: /^\d{5}$/,
  Australia: /^\d{4}$/,
  AU: /^\d{4}$/,
  Netherlands: /^[1-9]\d{3}\s?[A-Za-z]{2}$/,
  NL: /^[1-9]\d{3}\s?[A-Za-z]{2}$/,
  Italy: /^\d{5}$/,
  IT: /^\d{5}$/,
  Spain: /^\d{5}$/,
  ES: /^\d{5}$/,
  Japan: /^\d{3}-\d{4}$/,
  JP: /^\d{3}-\d{4}$/,
};

export function validatePostalCode(code: string, country: string): string {
  if (/[А-Яа-яЁё]/.test(code)) {
    return 'Russian letters are not allowed in postal code.';
  }

  if (!code.trim()) {
    return 'Postal code is required.';
  }

  const regex = patternsMap[country];
  if (!regex) {
    return '';
  }

  if (!regex.test(code)) {
    switch (country) {
      case 'United States':
      case 'US':
        return 'US postal code must be 5 digits (например: 90210 или 90210-1234).';
      case 'Canada':
      case 'CA':
        return 'Canadian postal code invalid (пример: A1A 1A1).';
      case 'United Kingdom':
      case 'GB':
      case 'UK':
        return 'UK postal code invalid (пример: EC1A 1BB).';
      case 'Germany':
      case 'DE':
        return 'German postal code must be 5 digits.';
      case 'Russia':
      case 'RU':
        return 'Russian postal code must be 6 digits.';
      case 'France':
      case 'FR':
        return 'French postal code must be 5 digits.';
      case 'Australia':
      case 'AU':
        return 'Australian postal code must be 4 digits.';
      case 'Netherlands':
      case 'NL':
        return 'Dutch postal code invalid (пример: 1234 AB).';
      case 'Italy':
      case 'IT':
        return 'Italian postal code must be 5 digits.';
      case 'Spain':
      case 'ES':
        return 'Spanish postal code must be 5 digits.';
      case 'Japan':
      case 'JP':
        return 'Japanese postal code invalid (пример: 123-4567).';
      default:
        return 'Postal code format is invalid.';
    }
  }

  return '';
}
