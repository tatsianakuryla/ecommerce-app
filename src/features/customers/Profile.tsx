import { useEffect, useState } from 'react';
import { Stack, Box, Text, Button, Icon } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';

import { useAuthContext } from '~hooks/useAuthContext';
import { useMakeRequest } from '~hooks/useMakeRequest';
import { fetchUserProfileRequest } from '~api/requests';
import {
  Customer,
  Address,
  AddressDraft,
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

const initialAddressErrorState: AddressError = {
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

  const [defaultShipIndex, setDefaultShipIndex] = useState<number | undefined>(
    undefined,
  );
  const [defaultBillIndex, setDefaultBillIndex] = useState<number | undefined>(
    undefined,
  );

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
    setAddressErrors(
      profile.addresses.map(() => ({ ...initialAddressErrorState })),
    );

    const shipIndex = profile.addresses.findIndex(
      (address) => address.id === profile.defaultShippingAddressId,
    );
    setDefaultShipIndex(shipIndex >= 0 ? shipIndex : undefined);

    const billIndex = profile.addresses.findIndex(
      (address) => address.id === profile.defaultBillingAddressId,
    );
    setDefaultBillIndex(billIndex >= 0 ? billIndex : undefined);
  }, [profile]);

  useEffect(() => {
    if (!accessToken) return;

    void makeRequest(fetchUserProfileRequest(accessToken), isCustomer).then(
      (customer) => {
        if (customer) {
          setProfile(customer);
        }
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
    setErrors((previous) => ({
      ...previous,
      email: validateEmail(value),
    }));
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
        message = '';
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

  const onAddAddress = () => {
    const newIndex = addressEdits.length;
    const temporaryId = `temp-${Date.now()}`;
    const newAddress: Address = {
      id: temporaryId,
      streetName: '',
      city: '',
      postalCode: '',
      country: '',
    };
    setAddressEdits((previous) => [...previous, newAddress]);
    setAddressErrors((previous) => [
      ...previous,
      { ...initialAddressErrorState },
    ]);
    setDefaultShipIndex(newIndex);
    setDefaultBillIndex(newIndex);
  };

  const onDeleteAddress = (indexToDelete: number): void => {
    const idToRemove = addressEdits[indexToDelete].id;

    setAddressEdits((previous) =>
      previous.filter((_, index) => index !== indexToDelete),
    );
    setAddressErrors((previous) =>
      previous.filter((_, index) => index !== indexToDelete),
    );

    if (idToRemove.startsWith('temp-')) {
      setDefaultShipIndex((previous) => {
        if (previous === undefined) return undefined;
        if (previous === indexToDelete) return undefined;
        return previous > indexToDelete ? previous - 1 : previous;
      });
      setDefaultBillIndex((previous) => {
        if (previous === undefined) return undefined;
        if (previous === indexToDelete) return undefined;
        return previous > indexToDelete ? previous - 1 : previous;
      });
      return;
    }

    if (profile && accessToken) {
      updateProfile(profile.id, profile.version, [
        {
          action: 'removeAddress',
          addressId: idToRemove,
        },
      ])
        .then((updatedCustomer) => {
          if (!updatedCustomer) return;
          setProfile(updatedCustomer);
          Toastify({
            ...profileToastifyOptions,
            text: 'Address deleted successfully',
          }).showToast();
        })
        .catch(() => {
          Toastify({
            ...profileToastifyOptions,
            text: 'Error deleting address',
          }).showToast();
        });
    }
  };

  const hasErrorsInProfile =
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

    const originalAddresses = profile.addresses;

    addressEdits.forEach((address) => {
      const found = originalAddresses.find(
        (address) => address.id === address.id,
      );
      if (!found) {
        const draft: AddressDraft = {
          streetName: address.streetName,
          city: address.city,
          postalCode: address.postalCode,
          country: address.country,
        };
        actions.push({ action: 'addAddress', address: draft });
      }
    });

    originalAddresses.forEach((original) => {
      const stillExists = addressEdits.some(
        (address) => address.id === original.id,
      );
      if (!stillExists) {
        actions.push({ action: 'removeAddress', addressId: original.id });
      }
    });

    addressEdits.forEach((address) => {
      const original = originalAddresses.find(
        (address) => address.id === address.id,
      );
      if (original) {
        if (
          address.streetName !== original.streetName ||
          address.city !== original.city ||
          address.postalCode !== original.postalCode ||
          address.country !== original.country
        ) {
          const draft: AddressDraft = {
            streetName: address.streetName,
            city: address.city,
            postalCode: address.postalCode,
            country: address.country,
          };
          actions.push({
            action: 'changeAddress',
            addressId: original.id,
            address: draft,
          });
        }
      }
    });

    if (defaultShipIndex !== undefined) {
      const newShipId = addressEdits[defaultShipIndex].id;
      if (
        !newShipId.startsWith('temp-') &&
        newShipId !== profile.defaultShippingAddressId
      ) {
        actions.push({
          action: 'setDefaultShippingAddress',
          addressId: newShipId,
        });
      }
    }
    if (defaultBillIndex !== undefined) {
      const newBillId = addressEdits[defaultBillIndex].id;
      if (
        !newBillId.startsWith('temp-') &&
        newBillId !== profile.defaultBillingAddressId
      ) {
        actions.push({
          action: 'setDefaultBillingAddress',
          addressId: newBillId,
        });
      }
    }

    const originalCount = originalAddresses.length;
    const editedCount = addressEdits.length;
    const addressesCountChanged = originalCount !== editedCount;

    if (actions.length === 0 && !addressesCountChanged) {
      Toastify({
        ...profileToastifyOptions,
        text: 'No changes to save',
      }).showToast();
      return;
    }

    try {
      const updatedCustomer = await updateProfile(
        profile.id,
        profile.version,
        actions,
      );
      if (updatedCustomer) {
        setProfile(updatedCustomer);
        Toastify({
          ...profileToastifyOptions,
          text: 'Profile saved successfully',
        }).showToast();
        setIsEditing(false);
      }
    } catch {
      Toastify({
        ...profileToastifyOptions,
        text: error
          ? `Failed to save profile. ${error}`
          : 'Failed to save profile.',
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
        profileData={{ email, firstName, lastName, dateOfBirth }}
        onEmailChange={onEmailChange}
        onFirstNameChange={onFirstNameChange}
        onLastNameChange={onLastNameChange}
        onDateOfBirthChange={onDateOfBirthChange}
        onToggleEdit={() => {
          setIsEditing((previous) => !previous);
        }}
        onSave={() => void saveChanges()}
        hasErrors={hasErrorsInProfile}
      />

      <Box>
        {isEditing && (
          <Button size='sm' colorScheme='purple' onClick={onAddAddress}>
            <Icon as={FiPlus} mr={2} />
            Add Address
          </Button>
        )}

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
          onDeleteAddress={onDeleteAddress}
        />
      </Box>
    </Stack>
  );
}
