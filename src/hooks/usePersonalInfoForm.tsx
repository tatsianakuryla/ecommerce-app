import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  formatDateInput,
  validateDateOfBirth,
  validateFirstName,
  validateLastName,
} from '~components/Form/RegistrationForm/registrationFormValidation.ts';

export function usePersonalInfoForm(initial: {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}) {
  const [values, setValues] = useState({
    firstName: initial.firstName,
    lastName: initial.lastName,
    dateOfBirth: initial.dateOfBirth,
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    setValues({
      firstName: initial.firstName,
      lastName: initial.lastName,
      dateOfBirth: initial.dateOfBirth,
    });
    setErrors({ firstName: '', lastName: '', dateOfBirth: '' });
  }, [initial]);

  const onFirstNameChange = useCallback((value: string) => {
    setValues((previous) => ({ ...previous, firstName: value }));
    setErrors((previous) => ({
      ...previous,
      firstName: validateFirstName(value),
    }));
  }, []);

  const onLastNameChange = useCallback((value: string) => {
    setValues((previous) => ({ ...previous, lastName: value }));
    setErrors((previous) => ({
      ...previous,
      lastName: validateLastName(value),
    }));
  }, []);

  const onDateOfBirthChange = useCallback((raw: string) => {
    const formatted = formatDateInput(raw);
    setValues((previous) => ({ ...previous, dateOfBirth: formatted }));
    setErrors((previous) => ({
      ...previous,
      dateOfBirth: validateDateOfBirth(formatted),
    }));
  }, []);

  const hasErrors = useMemo(
    () => !!errors.firstName || !!errors.lastName || !!errors.dateOfBirth,
    [errors],
  );

  return {
    values,
    errors,
    hasErrors,
    onFirstNameChange,
    onLastNameChange,
    onDateOfBirthChange,
  };
}
