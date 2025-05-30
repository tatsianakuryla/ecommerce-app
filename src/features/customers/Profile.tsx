import { useEffect, useState } from 'react';
import {
  Stack,
  Box,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  Icon,
  Badge,
} from '@chakra-ui/react';
import { Card, CardHeader, CardBody } from '@chakra-ui/card';
import { FiUser, FiMapPin } from 'react-icons/fi';
import { useAuthContext } from '~hooks/useAuthContext';
import { useMakeRequest } from '~hooks/useMakeRequest';
import { fetchUserProfileRequest } from '~api/requests';
import type { Customer, Address } from '~types/types';
import { ErrorAlert } from '~components/ErrorAlert/ErrorAlert';
import { isCustomer } from '~utils/typeguards.ts';

export function Profile() {
  const { accessToken } = useAuthContext();
  const { makeRequest, loading, error } = useMakeRequest();
  const [profile, setProfile] = useState<Customer | null>(null);

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
          <Heading size='md'>Personal Information</Heading>
        </CardHeader>
        <CardBody>
          <Stack direction='column' gap='1rem'>
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
                {dateOfBirth ? new Date(dateOfBirth).toLocaleDateString() : '—'}
              </Text>
            </Box>
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
              {addresses.map(renderAddress)}
            </SimpleGrid>
          )}
        </CardBody>
      </Card>
    </Stack>
  );
}
