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
import { Card, CardHeader, CardBody } from '@chakra-ui/card';
import { FiUser, FiMapPin } from 'react-icons/fi';
import { useAuthContext } from '~hooks/useAuthContext';
import { useMakeRequest } from '~hooks/useMakeRequest';
import { fetchUserProfileRequest, updateCustomerRequest } from '~api/requests';
import { Customer, Address, CustomerUpdateAction } from '~types/types';
import { ErrorAlert } from '~components/ErrorAlert/ErrorAlert';
import { isCustomer } from '~utils/typeguards.ts';
import Toastify from 'toastify-js';

export function Profile() {
  const { accessToken } = useAuthContext();
  const { makeRequest, loading, error } = useMakeRequest();
  const [profile, setProfile] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<{
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  }>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    if (profile) {
      setEditData({
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        dateOfBirth: profile.dateOfBirth ?? '',
      });
    }
  }, [profile]);

  const [addressEdits, setAddressEdits] = useState<Address[]>([]);
  const [defaultShipIdx, setDefaultShipIdx] = useState<number>();
  const [defaultBillIdx, setDefaultBillIdx] = useState<number>();

  useEffect(() => {
    if (!profile) return;

    setEditData({
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      dateOfBirth: profile.dateOfBirth ?? '',
    });

    setAddressEdits(profile.addresses);
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

  const saveChanges = async () => {
    if (!profile || !accessToken) return;

    const actions: CustomerUpdateAction[] = [];
    if (editData.firstName !== profile.firstName) {
      actions.push({
        action: 'setFirstName',
        firstName: editData.firstName,
      });
    }
    if (editData.lastName !== profile.lastName) {
      actions.push({
        action: 'setLastName',
        lastName: editData.lastName,
      });
    }
    if (editData.dateOfBirth !== profile.dateOfBirth) {
      actions.push({
        action: 'setDateOfBirth',
        dateOfBirth: editData.dateOfBirth,
      });
    }

    addressEdits.forEach((addr: Address, idx: number) => {
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
      const newShipId = addressEdits[defaultShipIdx].id;
      if (newShipId !== profile.defaultShippingAddressId) {
        actions.push({
          action: 'setDefaultShippingAddress',
          addressId: newShipId,
        });
      }
    }
    if (defaultBillIdx !== undefined) {
      const newBillId = addressEdits[defaultBillIdx].id;
      if (newBillId !== profile.defaultBillingAddressId) {
        actions.push({
          action: 'setDefaultBillingAddress',
          addressId: newBillId,
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

  useEffect(() => {
    if (!accessToken) return;
    void makeRequest(fetchUserProfileRequest(accessToken), isCustomer).then(
      (customer) => {
        if (customer) setProfile(customer);
      },
    );
  }, [accessToken, makeRequest]);

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
    const isDefaultShipping = address.id === defaultShippingAddressId;
    const isDefaultBilling = address.id === defaultBillingAddressId;

    return (
      <Box
        key={address.id}
        p='1rem'
        borderWidth='1px'
        borderRadius='lg'
        boxShadow='sm'
        position='relative'
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
        <Stack gap={1}>
          {isDefaultShipping && <Badge colorScheme='green'>Shipping</Badge>}
          {isDefaultBilling && <Badge colorScheme='blue'>Billing</Badge>}
        </Stack>
      </Box>
    );
  };

  return (
    <Stack gap='2rem' maxW='800px' mx='auto'>
      <Card>
        <CardHeader display='flex' alignItems='center' gap='1rem' mb='1rem'>
          <Icon as={FiUser} boxSize={6} color='teal.500' />
          <Heading size='md' mr='auto'>
            Personal Information
          </Heading>
          <HStack gap={2} mt={2}>
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
          <Stack direction='column' gap='1rem'>
            {isEditing ? (
              <>
                <Box>
                  <Text fontWeight='semibold'>First Name</Text>
                  <Input
                    value={editData.firstName}
                    onChange={(e) => {
                      setEditData((d) => ({ ...d, firstName: e.target.value }));
                    }}
                  />
                </Box>
                <Box>
                  <Text fontWeight='semibold'>Last Name</Text>
                  <Input
                    value={editData.lastName}
                    onChange={(e) => {
                      setEditData((d) => ({ ...d, lastName: e.target.value }));
                    }}
                  />
                </Box>
                <Box>
                  <Text fontWeight='semibold'>Date of Birth</Text>
                  <Input
                    placeholder='YYYY-MM-DD'
                    value={editData.dateOfBirth}
                    onChange={(e) => {
                      setEditData((d) => ({
                        ...d,
                        dateOfBirth: e.target.value,
                      }));
                    }}
                  />
                </Box>
              </>
            ) : (
              <>
                <Box>
                  <Text fontWeight='semibold'>First Name</Text>
                  <Text>{firstName}</Text>
                </Box>
                <Box>
                  <Text fontWeight='semibold'>Last Name</Text>
                  <Text>{lastName}</Text>
                </Box>
                <Box>
                  <Text fontWeight='semibold'>Date of Birth</Text>
                  <Text>
                    {dateOfBirth
                      ? new Date(dateOfBirth).toLocaleDateString()
                      : '—'}
                  </Text>
                </Box>
              </>
            )}
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardHeader display='flex' gap='1rem' mb='1rem'>
          <Icon as={FiMapPin} boxSize={6} color='purple.500' />
          <Heading size='md'>Addresses</Heading>
        </CardHeader>
        <CardBody>
          {addresses.length === 0 ? (
            <Text>No saved addresses.</Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap='1rem'>
              {addressEdits.map((addr, idx) => (
                <Box
                  key={addr.id}
                  p='1rem'
                  borderWidth='1px'
                  borderRadius='lg'
                  mb='1rem'
                >
                  {isEditing ? (
                    <>
                      <Input
                        mb={2}
                        value={addr.streetName}
                        onChange={(e) => {
                          setAddressEdits((list) =>
                            list.map((x, i) =>
                              i === idx
                                ? { ...x, streetName: e.target.value }
                                : x,
                            ),
                          );
                        }}
                        placeholder='Street'
                      />
                      <Input
                        mb={2}
                        value={addr.city}
                        onChange={(e) => {
                          setAddressEdits((list) =>
                            list.map((x, i) =>
                              i === idx ? { ...x, city: e.target.value } : x,
                            ),
                          );
                        }}
                        placeholder='City'
                      />
                      <Input
                        mb={2}
                        value={addr.postalCode}
                        onChange={(e) => {
                          setAddressEdits((list) =>
                            list.map((x, i) =>
                              i === idx
                                ? { ...x, postalCode: e.target.value }
                                : x,
                            ),
                          );
                        }}
                        placeholder='Postal Code'
                      />
                      <Input
                        mb={2}
                        value={addr.country}
                        onChange={(e) => {
                          setAddressEdits((list) =>
                            list.map((x, i) =>
                              i === idx ? { ...x, country: e.target.value } : x,
                            ),
                          );
                        }}
                        placeholder='Country'
                      />

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
