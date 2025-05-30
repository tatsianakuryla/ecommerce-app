import { useEffect, useState } from 'react';
import {
  Stack,
  Box,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  Icon,
  Input,
  Badge,
  HStack,
  Button,
} from '@chakra-ui/react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/form-control';
import { Card, CardHeader, CardBody } from '@chakra-ui/card';
import { FiUser, FiMapPin } from 'react-icons/fi';
import { useAuthContext } from '~hooks/useAuthContext';
import { useMakeRequest } from '~hooks/useMakeRequest';
import { fetchUserProfileRequest, updateCustomerRequest } from '~api/requests';
import { Customer, Address, CustomerUpdateAction } from '~types/types';
import { ErrorAlert } from '~components/ErrorAlert/ErrorAlert';
import { isCustomer } from '~utils/typeguards.ts';
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
} from '~components/RegistrationForm/registrationFormValidation';

export function Profile() {
  const { accessToken } = useAuthContext();
  const { makeRequest, loading, error } = useMakeRequest();

  const [profile, setProfile] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  });

  const [addressEdits, setAddressEdits] = useState<Address[]>([]);
  const [addressErrors, setAddressErrors] = useState<
    Array<{ street: string; city: string; postalCode: string; country: string }>
  >([]);
  const [defaultShipIdx, setDefaultShipIdx] = useState<number>();
  const [defaultBillIdx, setDefaultBillIdx] = useState<number>();

  useEffect(() => {
    if (!profile) return;

    setEditData({
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      dateOfBirth: profile.dateOfBirth ?? '',
    });
    setErrors({ firstName: '', lastName: '', dateOfBirth: '' });

    setAddressEdits(profile.addresses);
    setAddressErrors(
      profile.addresses.map(() => ({
        street: '',
        city: '',
        postalCode: '',
        country: '',
      })),
    );
    setDefaultShipIdx(
      profile.addresses.findIndex(
        (a) => a.id === profile.defaultShippingAddressId,
      ),
    );
    setDefaultBillIdx(
      profile.addresses.findIndex(
        (a) => a.id === profile.defaultBillingAddressId,
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

  const onFirstNameChange = (val: string) => {
    setEditData((d) => ({ ...d, firstName: val }));
    setErrors((e) => ({ ...e, firstName: validateFirstName(val) }));
  };
  const onLastNameChange = (val: string) => {
    setEditData((d) => ({ ...d, lastName: val }));
    setErrors((e) => ({ ...e, lastName: validateLastName(val) }));
  };
  const onDobChange = (raw: string) => {
    const formatted = formatDateInput(raw);
    setEditData((d) => ({ ...d, dateOfBirth: formatted }));
    setErrors((e) => ({
      ...e,
      dateOfBirth: validateDateOfBirth(formatted),
    }));
  };

  const onAddressFieldChange = (
    idx: number,
    field: keyof (typeof addressErrors)[0],
    value: string,
  ) => {
    setAddressEdits((list) =>
      list.map((addr, i) => (i === idx ? { ...addr, [field]: value } : addr)),
    );
    let msg = '';
    switch (field) {
      case 'street':
        msg = validateStreet(value);
        break;
      case 'city':
        msg = validateCity(value);
        break;
      case 'postalCode':
        msg = validatePostalCode(value, addressEdits[idx].country);
        break;
      case 'country':
        msg = validateCountry(value);
        break;
    }
    setAddressErrors((list) =>
      list.map((err, i) => (i === idx ? { ...err, [field]: msg } : err)),
    );
  };

  const hasErrors =
    !!errors.firstName ||
    !!errors.lastName ||
    !!errors.dateOfBirth ||
    addressErrors.some((errObj) => Object.values(errObj).some((msg) => !!msg));

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

    addressEdits.forEach((addr, idx) => {
      const old = profile.addresses[idx];
      if (
        addr.streetName !== old.streetName ||
        addr.city !== old.city ||
        addr.postalCode !== old.postalCode ||
        addr.country !== old.country
      ) {
        actions.push({
          action: 'changeAddress',
          addressId: old.id,
          address: addr,
        });
      }
    });

    if (defaultShipIdx !== undefined) {
      const newId = addressEdits[defaultShipIdx].id;
      if (newId !== profile.defaultShippingAddressId) {
        actions.push({
          action: 'setDefaultShippingAddress',
          addressId: newId,
        });
      }
    }
    if (defaultBillIdx !== undefined) {
      const newId = addressEdits[defaultBillIdx].id;
      if (newId !== profile.defaultBillingAddressId) {
        actions.push({
          action: 'setDefaultBillingAddress',
          addressId: newId,
        });
      }
    }

    try {
      await makeRequest(
        updateCustomerRequest(
          profile.id,
          profile.version,
          actions,
          accessToken,
        ),
        isCustomer,
      );
      Toastify({
        text: 'Profile updated!',
        backgroundColor: 'green',
      }).showToast();
      setIsEditing(false);
      const refreshed = await makeRequest(
        fetchUserProfileRequest(accessToken),
        isCustomer,
      );
      if (refreshed) setProfile(refreshed);
    } catch {
      Toastify({ text: 'Update failed', backgroundColor: 'red' }).showToast();
    }
  };

  if (loading) return <Spinner size='xl' mt='4rem' />;
  if (error) return <ErrorAlert name='profile' error={error} />;
  if (!profile) return <Text mt='4rem'>Profile not found.</Text>;

  const {
    firstName = '—',
    lastName = '—',
    dateOfBirth,
    addresses,
    defaultShippingAddressId,
    defaultBillingAddressId,
  } = profile;

  const renderAddress = (addr: Address) => {
    const isShip = addr.id === defaultShippingAddressId;
    const isBill = addr.id === defaultBillingAddressId;
    return (
      <Box
        key={addr.id}
        p='1rem'
        borderWidth='1px'
        borderRadius='lg'
        boxShadow='sm'
      >
        <Stack gap={1}>
          <Text>
            <strong>Street:</strong> {addr.streetName}
          </Text>
          <Text>
            <strong>City:</strong> {addr.city}
          </Text>
          <Text>
            <strong>Postal:</strong> {addr.postalCode}
          </Text>
          <Text>
            <strong>Country:</strong> {addr.country}
          </Text>
        </Stack>
        <Stack direction='row' gap={2} mt={2}>
          {isShip && <Badge colorScheme='green'>Shipping</Badge>}
          {isBill && <Badge colorScheme='blue'>Billing</Badge>}
        </Stack>
      </Box>
    );
  };

  return (
    <Stack gap='2rem' maxW='800px' mx='auto'>
      <Card>
        <CardHeader display='flex' alignItems='center' gap='1rem'>
          <Icon as={FiUser} boxSize={6} color='teal.500' />
          <Heading size='md'>Personal Information</Heading>
          <HStack ml='auto'>
            {isEditing ? (
              <>
                <Button
                  size='sm'
                  onClick={() => {
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size='sm'
                  colorScheme='teal'
                  onClick={() => void saveChanges()}
                  disabled={hasErrors}
                >
                  Save
                </Button>
              </>
            ) : (
              <Button
                size='sm'
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                Edit
              </Button>
            )}
          </HStack>
        </CardHeader>
        <CardBody>
          {isEditing ? (
            <Stack gap='1rem'>
              <FormControl isInvalid={!!errors.firstName}>
                <FormLabel>First Name</FormLabel>
                <Input
                  value={editData.firstName}
                  onChange={(e) => {
                    onFirstNameChange(e.target.value);
                  }}
                />
                <FormErrorMessage>{errors.firstName}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.lastName}>
                <FormLabel>Last Name</FormLabel>
                <Input
                  value={editData.lastName}
                  onChange={(e) => {
                    onLastNameChange(e.target.value);
                  }}
                />
                <FormErrorMessage>{errors.lastName}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.dateOfBirth}>
                <FormLabel>Date of Birth</FormLabel>
                <Input
                  placeholder='YYYY-MM-DD'
                  value={editData.dateOfBirth}
                  onChange={(e) => {
                    onDobChange(e.target.value);
                  }}
                />
                <FormErrorMessage>{errors.dateOfBirth}</FormErrorMessage>
              </FormControl>
            </Stack>
          ) : (
            <Stack gap='1rem'>
              <Text>
                <strong>First Name:</strong> {firstName}
              </Text>
              <Text>
                <strong>Last Name:</strong> {lastName}
              </Text>
              <Text>
                <strong>Date of Birth:</strong>{' '}
                {dateOfBirth ? new Date(dateOfBirth).toLocaleDateString() : '—'}
              </Text>
            </Stack>
          )}
        </CardBody>
      </Card>

      {/* Addresses */}
      <Card>
        <CardHeader display='flex' alignItems='center' gap='1rem'>
          <Icon as={FiMapPin} boxSize={6} color='purple.500' />
          <Heading size='md'>Addresses</Heading>
        </CardHeader>
        <CardBody>
          {addresses.length === 0 ? (
            <Text>No saved addresses.</Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap='1rem'>
              {addressEdits.map((addr, idx) => (
                <Box key={addr.id} p='1rem' borderWidth='1px' borderRadius='lg'>
                  {isEditing ? (
                    <>
                      <FormControl isInvalid={!!addressErrors[idx].street}>
                        <FormLabel>Street</FormLabel>
                        <Input
                          mb={2}
                          value={addr.streetName}
                          onChange={(e) => {
                            onAddressFieldChange(idx, 'street', e.target.value);
                          }}
                        />
                        <FormErrorMessage>
                          {addressErrors[idx].street}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!addressErrors[idx].city}>
                        <FormLabel>City</FormLabel>
                        <Input
                          mb={2}
                          value={addr.city}
                          onChange={(e) => {
                            onAddressFieldChange(idx, 'city', e.target.value);
                          }}
                        />
                        <FormErrorMessage>
                          {addressErrors[idx].city}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!addressErrors[idx].postalCode}>
                        <FormLabel>Postal Code</FormLabel>
                        <Input
                          mb={2}
                          value={addr.postalCode}
                          onChange={(e) => {
                            onAddressFieldChange(
                              idx,
                              'postalCode',
                              e.target.value,
                            );
                          }}
                        />
                        <FormErrorMessage>
                          {addressErrors[idx].postalCode}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!addressErrors[idx].country}>
                        <FormLabel>Country</FormLabel>
                        <Input
                          mb={2}
                          value={addr.country}
                          onChange={(e) => {
                            onAddressFieldChange(
                              idx,
                              'country',
                              e.target.value,
                            );
                          }}
                        />
                        <FormErrorMessage>
                          {addressErrors[idx].country}
                        </FormErrorMessage>
                      </FormControl>

                      <HStack mt={2} gap={4}>
                        <Button
                          size='sm'
                          variant={defaultShipIdx === idx ? 'solid' : 'outline'}
                          colorScheme='green'
                          onClick={() => {
                            setDefaultShipIdx(idx);
                          }}
                        >
                          Default Ship
                        </Button>
                        <Button
                          size='sm'
                          variant={defaultBillIdx === idx ? 'solid' : 'outline'}
                          colorScheme='blue'
                          onClick={() => {
                            setDefaultBillIdx(idx);
                          }}
                        >
                          Default Bill
                        </Button>
                      </HStack>
                    </>
                  ) : (
                    renderAddress(addr)
                  )}
                </Box>
              ))}
            </SimpleGrid>
          )}
        </CardBody>
      </Card>
    </Stack>
  );
}
