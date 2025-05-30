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
  const [defaultShipIndex, setDefaultShipIndex] = useState<number>();
  const [defaultBillIndex, setDefaultBillIndex] = useState<number>();

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
    setEditData((data) => ({ ...data, firstName: value }));
    setErrors((event) => ({ ...event, firstName: validateFirstName(value) }));
  };
  const onLastNameChange = (value: string) => {
    setEditData((data) => ({ ...data, lastName: value }));
    setErrors((event) => ({ ...event, lastName: validateLastName(value) }));
  };
  const onDateOfBirthChange = (raw: string) => {
    const formatted = formatDateInput(raw);
    setEditData((data) => ({ ...data, dateOfBirth: formatted }));
    setErrors((event) => ({
      ...event,
      dateOfBirth: validateDateOfBirth(formatted),
    }));
  };

  const onAddressFieldChange = (
    index: number,
    field: keyof (typeof addressErrors)[0],
    value: string,
  ) => {
    setAddressEdits((list) =>
      list.map((address, index) =>
        index === index ? { ...address, [field]: value } : address,
      ),
    );
    let message = '';
    switch (field) {
      case 'street':
        message = validateStreet(value);
        break;
      case 'city':
        message = validateCity(value);
        break;
      case 'postalCode':
        message = validatePostalCode(value, addressEdits[index].country);
        break;
      case 'country':
        message = validateCountry(value);
        break;
    }
    setAddressErrors((list) =>
      list.map((error, index) =>
        index === index ? { ...error, [field]: message } : error,
      ),
    );
  };

  const hasErrors =
    !!errors.firstName ||
    !!errors.lastName ||
    !!errors.dateOfBirth ||
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
      const newId = addressEdits[defaultShipIndex].id;
      if (newId !== profile.defaultShippingAddressId) {
        actions.push({
          action: 'setDefaultShippingAddress',
          addressId: newId,
        });
      }
    }
    if (defaultBillIndex !== undefined) {
      const newId = addressEdits[defaultBillIndex].id;
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

  const renderAddress = (address: Address) => {
    const isShip = address.id === defaultShippingAddressId;
    const isBill = address.id === defaultBillingAddressId;
    return (
      <Box
        key={address.id}
        p='1rem'
        borderWidth='1px'
        borderRadius='lg'
        boxShadow='sm'
      >
        <Stack gap={1}>
          <Text>
            <strong>Street:</strong> {address.streetName}
          </Text>
          <Text>
            <strong>City:</strong> {address.city}
          </Text>
          <Text>
            <strong>Postal:</strong> {address.postalCode}
          </Text>
          <Text>
            <strong>Country:</strong> {address.country}
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
                  onChange={(event) => {
                    onFirstNameChange(event.target.value);
                  }}
                />
                <FormErrorMessage>{errors.firstName}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.lastName}>
                <FormLabel>Last Name</FormLabel>
                <Input
                  value={editData.lastName}
                  onChange={(event) => {
                    onLastNameChange(event.target.value);
                  }}
                />
                <FormErrorMessage>{errors.lastName}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.dateOfBirth}>
                <FormLabel>Date of Birth</FormLabel>
                <Input
                  placeholder='YYYY-MM-DD'
                  value={editData.dateOfBirth}
                  onChange={(event) => {
                    onDateOfBirthChange(event.target.value);
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
              {addressEdits.map((address, index) => (
                <Box
                  key={address.id}
                  p='1rem'
                  borderWidth='1px'
                  borderRadius='lg'
                >
                  {isEditing ? (
                    <>
                      <FormControl isInvalid={!!addressErrors[index].street}>
                        <FormLabel>Street</FormLabel>
                        <Input
                          mb={2}
                          value={address.streetName}
                          onChange={(event) => {
                            onAddressFieldChange(
                              index,
                              'street',
                              event.target.value,
                            );
                          }}
                        />
                        <FormErrorMessage>
                          {addressErrors[index].street}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!addressErrors[index].city}>
                        <FormLabel>City</FormLabel>
                        <Input
                          mb={2}
                          value={address.city}
                          onChange={(event) => {
                            onAddressFieldChange(
                              index,
                              'city',
                              event.target.value,
                            );
                          }}
                        />
                        <FormErrorMessage>
                          {addressErrors[index].city}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl
                        isInvalid={!!addressErrors[index].postalCode}
                      >
                        <FormLabel>Postal Code</FormLabel>
                        <Input
                          mb={2}
                          value={address.postalCode}
                          onChange={(event) => {
                            onAddressFieldChange(
                              index,
                              'postalCode',
                              event.target.value,
                            );
                          }}
                        />
                        <FormErrorMessage>
                          {addressErrors[index].postalCode}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!addressErrors[index].country}>
                        <FormLabel>Country</FormLabel>
                        <Input
                          mb={2}
                          value={address.country}
                          onChange={(event) => {
                            onAddressFieldChange(
                              index,
                              'country',
                              event.target.value,
                            );
                          }}
                        />
                        <FormErrorMessage>
                          {addressErrors[index].country}
                        </FormErrorMessage>
                      </FormControl>

                      <HStack mt={2} gap={4}>
                        <Button
                          size='sm'
                          variant={
                            defaultShipIndex === index ? 'solid' : 'outline'
                          }
                          colorScheme='green'
                          onClick={() => {
                            setDefaultShipIndex(index);
                          }}
                        >
                          Default Ship
                        </Button>
                        <Button
                          size='sm'
                          variant={
                            defaultBillIndex === index ? 'solid' : 'outline'
                          }
                          colorScheme='blue'
                          onClick={() => {
                            setDefaultBillIndex(index);
                          }}
                        >
                          Default Bill
                        </Button>
                      </HStack>
                    </>
                  ) : (
                    renderAddress(address)
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
