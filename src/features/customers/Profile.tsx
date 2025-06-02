import { useEffect, useState } from 'react';
import { Stack, Box, Text } from '@chakra-ui/react';
import { useAuthContext } from '~hooks/useAuthContext';
import { useMakeRequest } from '~hooks/useMakeRequest';
import { fetchUserProfileRequest } from '~api/requests';
import {
  Customer,
  Address,
  CustomerUpdateAction,
  AddressError,
} from '~types/types';
import { isCustomer } from '~utils/typeguards';
import Toastify from 'toastify-js';
import {
  validateFirstName,
  validateLastName,
  formatDateInput,
  validateDateOfBirth,
  validateStreet,
  validateCity,
  validatePostalCode,
  validateCountry,
  validateEmail,
} from '~components/Form/RegistrationForm/registrationFormValidation';
import { ProgressCircleElement } from '~components/Progress-circle/Progress-circle.tsx';
import { profileToastifyOptions, profileBoxStyle } from '~/styles/style.ts';
import { PersonalInfo } from './PersonalInfo';
import { Addresses } from './Addresses';

const initialAddressState = {
  streetName: '',
  city: '',
  postalCode: '',
  country: '',
};

const initialProfileState = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  email: '',
};

export function Profile() {
  const { accessToken, error, updateProfile } = useAuthContext();
  const { makeRequest, loading } = useMakeRequest();

  const [profile, setProfile] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState(initialProfileState);
  const [errors, setErrors] = useState(initialProfileState);

  const [addressEdits, setAddressEdits] = useState<Address[]>([]);
  const [addressErrors, setAddressErrors] = useState<AddressError[]>([]);

  const [defaultShipIndex, setDefaultShipIndex] = useState<number>();
  const [defaultBillIndex, setDefaultBillIndex] = useState<number>();

  useEffect(() => {
    if (!profile) return;
    setEditData({
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      dateOfBirth: profile.dateOfBirth ?? '',
      email: profile.email,
    });
    setErrors(initialProfileState);

    setAddressEdits(profile.addresses);
    setAddressErrors(profile.addresses.map(() => initialAddressState));

    setDefaultShipIndex(
      profile.addresses.findIndex(
        (address) => address.id === profile.defaultShippingAddressId,
      ),
    );
    setDefaultBillIndex(
      profile.addresses.findIndex(
        (address) => address.id === profile.defaultBillingAddressId,
      ),
    );
  }, [profile]);

  useEffect(() => {
    if (!accessToken) return;
    void makeRequest(fetchUserProfileRequest(accessToken), isCustomer).then(
      (customer) => {
        if (customer) setProfile(customer);
      },
    );
  }, [accessToken, makeRequest]);

  const onFirstNameChange = (value: string) => {
    setEditData((previous) => ({ ...previous, firstName: value }));
    setErrors((previous) => ({
      ...previous,
      firstName: validateFirstName(value),
    }));
  };
  const onLastNameChange = (value: string) => {
    setEditData((previous) => ({ ...previous, lastName: value }));
    setErrors((previous) => ({
      ...previous,
      lastName: validateLastName(value),
    }));
  };
  const onDateOfBirthChange = (raw: string) => {
    const formatted = formatDateInput(raw);
    setEditData((previous) => ({ ...previous, dateOfBirth: formatted }));
    setErrors((previous) => ({
      ...previous,
      dateOfBirth: validateDateOfBirth(formatted),
    }));
  };
  const onEmailChange = (value: string) => {
    setEditData((previous) => ({ ...previous, email: value }));
    setErrors((previous) => ({ ...previous, email: validateEmail(value) }));
  };

  const onAddressFieldChange = (
    addressIndex: number,
    field: keyof AddressError,
    value: string,
  ) => {
    let message = '';
    switch (field) {
      case 'streetName':
        message = validateStreet(value);
        break;
      case 'city':
        message = validateCity(value);
        break;
      case 'postalCode': {
        const currentCountry = addressEdits[addressIndex].country;
        message = validatePostalCode(value, currentCountry);
        break;
      }
      case 'country':
        message = validateCountry(value);
        break;
      default:
        break;
    }

    setAddressEdits((list) =>
      list.map((address, index) =>
        index === addressIndex ? { ...address, [field]: value } : address,
      ),
    );
    setAddressErrors((list) =>
      list.map((errorObject, index) =>
        index === addressIndex
          ? { ...errorObject, [field]: message }
          : errorObject,
      ),
    );
  };

  const onSetDefaultShip = (index: number) => {
    setDefaultShipIndex(index);
  };
  const onSetDefaultBill = (index: number) => {
    setDefaultBillIndex(index);
  };

  const hasErrors =
    !!errors.firstName ||
    !!errors.lastName ||
    !!errors.dateOfBirth ||
    !!errors.email ||
    addressErrors.some((errorObject) =>
      Object.values(errorObject).some((message) => !!message),
    );

  const saveChanges = async () => {
    if (!profile || !accessToken) return;

    const actions: CustomerUpdateAction[] = [];

    if (editData.firstName !== profile.firstName) {
      actions.push({ action: 'setFirstName', firstName: editData.firstName });
    }
    if (editData.lastName !== profile.lastName) {
      actions.push({ action: 'setLastName', lastName: editData.lastName });
    }
    if (editData.dateOfBirth !== profile.dateOfBirth) {
      actions.push({
        action: 'setDateOfBirth',
        dateOfBirth: editData.dateOfBirth,
      });
    }
    if (editData.email !== profile.email) {
      actions.push({ action: 'changeEmail', email: editData.email });
    }

    addressEdits.forEach((address, index) => {
      const old = profile.addresses[index];
      if (
        address.streetName !== old.streetName ||
        address.city !== old.city ||
        address.postalCode !== old.postalCode ||
        address.country !== old.country
      ) {
        actions.push({
          action: 'changeAddress',
          addressId: old.id,
          address: address,
        });
      }
    });

    if (defaultShipIndex !== undefined) {
      const newShipId = addressEdits[defaultShipIndex].id;
      if (newShipId !== profile.defaultShippingAddressId) {
        actions.push({
          action: 'setDefaultShippingAddress',
          addressId: newShipId,
        });
      }
    }
    if (defaultBillIndex !== undefined) {
      const newBillId = addressEdits[defaultBillIndex].id;
      if (newBillId !== profile.defaultBillingAddressId) {
        actions.push({
          action: 'setDefaultBillingAddress',
          addressId: newBillId,
        });
      }
    }

    try {
      const updatedResponse = await updateProfile(
        profile.id,
        profile.version,
        actions,
      );
      if (updatedResponse) {
        setProfile(updatedResponse.customer);
        Toastify({
          ...profileToastifyOptions,
          text: 'The profile was saved successfully.',
        }).showToast();
        setIsEditing(false);
      }
    } catch {
      Toastify({
        ...profileToastifyOptions,
        text: error
          ? `The profile was not saved. ${error}`
          : 'The profile was not saved.',
      }).showToast();
    }
  };

  if (loading) {
    return (
      <Box {...profileBoxStyle}>
        <ProgressCircleElement />
      </Box>
    );
  }
  if (!profile) {
    return <Text mt='4rem'>Profile not found.</Text>;
  }

  const {
    firstName = '—',
    lastName = '—',
    dateOfBirth,
    email,
    addresses,
  } = profile;

  return (
    <Stack gap='2rem' maxW='800px' mx='auto' pt='2rem'>
      <PersonalInfo
        isEditing={isEditing}
        editData={editData}
        errors={errors}
        profileData={{
          email,
          firstName,
          lastName,
          dateOfBirth,
        }}
        onEmailChange={onEmailChange}
        onFirstNameChange={onFirstNameChange}
        onLastNameChange={onLastNameChange}
        onDateOfBirthChange={onDateOfBirthChange}
        onToggleEdit={() => {
          setIsEditing((previous) => !previous);
        }}
        onSave={() => {
          void saveChanges();
        }}
        hasErrors={hasErrors}
      />

      <Addresses
        addresses={addresses}
        addressEdits={addressEdits}
        addressErrors={addressErrors}
        defaultShipIndex={defaultShipIndex}
        defaultBillIndex={defaultBillIndex}
        isEditing={isEditing}
        onAddressFieldChange={onAddressFieldChange}
        onSetDefaultShip={onSetDefaultShip}
        onSetDefaultBill={onSetDefaultBill}
      />
    </Stack>
  );
}
