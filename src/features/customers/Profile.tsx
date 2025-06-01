import { useEffect, useState } from 'react';
import {
  Stack,
  Box,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  Input,
  Badge,
  HStack,
  Button,
} from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Card, CardHeader, CardBody } from '@chakra-ui/card';
import { FiUser, FiMapPin } from 'react-icons/fi';
import { useAuthContext } from '~hooks/useAuthContext';
import { useMakeRequest } from '~hooks/useMakeRequest';
import { fetchUserProfileRequest, updateCustomerRequest } from '~api/requests';
import { Customer, Address, CustomerUpdateAction } from '~types/types';
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
} from '~components/Form/RegistrationForm/registrationFormValidation';
import { ErrorAlert } from '~components/ErrorAlert/ErrorAlert.tsx';
import { ProgressCircleElement } from '~components/Progress-circle/Progress-circle.tsx';

export function Profile() {
  const toastifyOptions = {
    duration: 3000,
    close: false,
    gravity: 'bottom',
    position: 'center',
    stopOnFocus: true,
    style: {
      padding: '10px',
      background: 'linear-gradient(to right, #00b09b, #96c93d)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
      fontSize: '16px',
      color: '#fff',
      bottom: '5px',
      marginBottom: '0',
      left: '0',
      position: 'fixed',
      zIndex: '9999',
      cursor: 'pointer',
      borderRadius: '8px',
    },
  };

  const { accessToken } = useAuthContext();
  const { makeRequest, loading } = useMakeRequest();

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
    Array<{
      streetName: string;
      city: string;
      postalCode: string;
      country: string;
    }>
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
        streetName: '',
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
      case 'streetName':
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
        ...toastifyOptions,
        text: 'Profile updated!',
      }).showToast();
      setIsEditing(false);
      const refreshed = await makeRequest(
        fetchUserProfileRequest(accessToken),
        isCustomer,
      );
      if (refreshed) setProfile(refreshed);
    } catch {
      Toastify({
        ...toastifyOptions,
        text: 'Profile was not updated.',
      }).showToast();
    }
  };

  if (loading)
    return (
      <Box
        className='hi'
        minHeight='calc(100vh - 120px)'
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <ProgressCircleElement />
      </Box>
    );
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
        p={4}
        borderWidth='1px'
        borderRadius='xl'
        boxShadow='sm'
        bg='gray.50'
        _hover={{ boxShadow: 'md', bg: 'gray.100' }}
        transition='all 0.2s'
      >
        <Stack gap={1} fontSize='sm'>
          <HStack>
            <Text fontWeight='semibold' minW='80px'>
              Street:
            </Text>
            <Text>{address.streetName}</Text>
          </HStack>
          <HStack>
            <Text fontWeight='semibold' minW='80px'>
              City:
            </Text>
            <Text>{address.city}</Text>
          </HStack>
          <HStack>
            <Text fontWeight='semibold' minW='80px'>
              Postal:
            </Text>
            <Text>{address.postalCode}</Text>
          </HStack>
          <HStack>
            <Text fontWeight='semibold' minW='80px'>
              Country:
            </Text>
            <Text>{address.country}</Text>
          </HStack>
        </Stack>

        <HStack gap={2} mt={3}>
          {isShip && (
            <Badge colorScheme='green' px={2}>
              Shipping
            </Badge>
          )}
          {isBill && (
            <Badge colorScheme='blue' px={2}>
              Billing
            </Badge>
          )}
        </HStack>
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
                {errors.firstName && (
                  <ErrorAlert name='firstName' error={errors.firstName} />
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.lastName}>
                <FormLabel>Last Name</FormLabel>
                <Input
                  value={editData.lastName}
                  onChange={(event) => {
                    onLastNameChange(event.target.value);
                  }}
                />
                {errors.lastName && (
                  <ErrorAlert name='lastName' error={errors.lastName} />
                )}
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
                {errors.dateOfBirth && (
                  <ErrorAlert name='dateOfBirth' error={errors.dateOfBirth} />
                )}
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
        <CardHeader display='flex' alignItems='center' gap='1rem' mb='1rem'>
          <Icon as={FiMapPin} boxSize={6} color='purple.500' />
          <Heading size='md'>Addresses</Heading>
        </CardHeader>
        <CardBody>
          {addresses.length === 0 ? (
            <Text>No saved addresses.</Text>
          ) : (
            <Box bg='white' borderRadius='md'>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                {addressEdits.map((address, index) =>
                  isEditing ? (
                    <Box
                      key={address.id}
                      p={4}
                      borderWidth='1px'
                      borderRadius='xl'
                      boxShadow='sm'
                      bg='gray.50'
                      _hover={{ boxShadow: 'md', bg: 'gray.100' }}
                      transition='all 0.2s'
                    >
                      <Stack gap={3}>
                        <FormControl
                          isInvalid={!!addressErrors[index].streetName}
                        >
                          <FormLabel fontWeight='semibold'>Street</FormLabel>
                          <Input
                            value={address.streetName}
                            onChange={(event) => {
                              onAddressFieldChange(
                                index,
                                'streetName',
                                event.target.value,
                              );
                            }}
                          />
                          {addressErrors[index].streetName && (
                            <ErrorAlert
                              name={`address-street-${index}`}
                              error={addressErrors[index].streetName}
                            />
                          )}
                        </FormControl>

                        <FormControl isInvalid={!!addressErrors[index].city}>
                          <FormLabel fontWeight='semibold'>City</FormLabel>
                          <Input
                            value={address.city}
                            onChange={(event) => {
                              onAddressFieldChange(
                                index,
                                'city',
                                event.target.value,
                              );
                            }}
                          />
                          {addressErrors[index].city && (
                            <ErrorAlert
                              name={`address-city-${index}`}
                              error={addressErrors[index].city}
                            />
                          )}
                        </FormControl>

                        <FormControl
                          isInvalid={!!addressErrors[index].postalCode}
                        >
                          <FormLabel fontWeight='semibold'>
                            Postal Code
                          </FormLabel>
                          <Input
                            value={address.postalCode}
                            onChange={(event) => {
                              onAddressFieldChange(
                                index,
                                'postalCode',
                                event.target.value,
                              );
                            }}
                          />
                          {addressErrors[index].postalCode && (
                            <ErrorAlert
                              name={`address-postalCode-${index}`}
                              error={addressErrors[index].postalCode}
                            />
                          )}
                        </FormControl>

                        <FormControl isInvalid={!!addressErrors[index].country}>
                          <FormLabel fontWeight='semibold'>Country</FormLabel>
                          <Input
                            value={address.country}
                            onChange={(event) => {
                              onAddressFieldChange(
                                index,
                                'country',
                                event.target.value,
                              );
                            }}
                          />
                          {addressErrors[index].country && (
                            <ErrorAlert
                              name={`address-country-${index}`}
                              error={addressErrors[index].country}
                            />
                          )}
                        </FormControl>

                        <HStack gap={3} pt={2}>
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
                      </Stack>
                    </Box>
                  ) : (
                    renderAddress(address)
                  ),
                )}
              </SimpleGrid>
            </Box>
          )}
        </CardBody>
      </Card>
    </Stack>
  );
}
