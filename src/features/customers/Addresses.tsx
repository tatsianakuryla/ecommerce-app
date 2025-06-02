import {
  Stack,
  Box,
  SimpleGrid,
  Text,
  Input,
  HStack,
  Button,
  Icon,
  Badge,
} from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { FiMapPin } from 'react-icons/fi';
import { Address, AddressesProperties } from '~types/types';
import { ErrorAlert } from '~components/ErrorAlert/ErrorAlert';
import { profileBoxStyle } from '~/styles/style';

export function Addresses({
  addresses,
  addressEdits,
  addressErrors,
  defaultShipIndex,
  defaultBillIndex,
  isEditing,
  onAddressFieldChange,
  onSetDefaultShip,
  onSetDefaultBill,
}: AddressesProperties) {
  const renderAddressView = (address: Address, index: number) => {
    const isShip = index === defaultShipIndex;
    const isBill = index === defaultBillIndex;

    return (
      <Box
        key={address.id}
        _hover={{ boxShadow: 'md', bg: 'gray.100' }}
        {...profileBoxStyle}
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
    <Stack gap='2rem'>
      <HStack mb='1rem'>
        <Icon as={FiMapPin} boxSize={6} color='purple.500' />
        <Text fontSize='lg' fontWeight='semibold'>
          Addresses
        </Text>
      </HStack>

      {addresses.length === 0 ? (
        <Text>No saved addresses.</Text>
      ) : (
        <Box bg='white' borderRadius='md'>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            {addressEdits.map((address, index) =>
              isEditing ? (
                <Box
                  key={address.id}
                  _hover={{ boxShadow: 'md', bg: 'gray.100' }}
                  {...profileBoxStyle}
                >
                  <Stack gap={3}>
                    <FormControl
                      id={`address-${index}-street`}
                      isInvalid={!!addressErrors[index].streetName}
                    >
                      <FormLabel htmlFor='street-address' fontWeight='semibold'>
                        Street
                      </FormLabel>
                      <Input
                        id='street-address'
                        name={`address[${index}].streetName`}
                        type='text'
                        autoComplete='street-address'
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

                    <FormControl
                      id={`address-${index}-city`}
                      isInvalid={!!addressErrors[index].city}
                    >
                      <FormLabel htmlFor='address-level2' fontWeight='semibold'>
                        City
                      </FormLabel>
                      <Input
                        id='address-level2'
                        name={`address-level2`}
                        type='text'
                        autoComplete='address-level2'
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
                      id={`address-${index}-postalCode`}
                      isInvalid={!!addressErrors[index].postalCode}
                    >
                      <FormLabel htmlFor='postal-code' fontWeight='semibold'>
                        Postal Code{' '}
                      </FormLabel>
                      <Input
                        id='postal-code'
                        name={`address[${index}].postalCode`}
                        type='text'
                        autoComplete='postal-code'
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

                    <FormControl
                      id={`address-${index}-country`}
                      isInvalid={!!addressErrors[index].country}
                    >
                      <FormLabel htmlFor='country-name' fontWeight='semibold'>
                        Country
                      </FormLabel>
                      <Input
                        id='country-name'
                        name={`address[${index}].country`}
                        type='text'
                        autoComplete='country-name'
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
                          onSetDefaultShip(index);
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
                          onSetDefaultBill(index);
                        }}
                      >
                        Default Bill
                      </Button>
                    </HStack>
                  </Stack>
                </Box>
              ) : (
                renderAddressView(addresses[index], index)
              ),
            )}
          </SimpleGrid>
        </Box>
      )}
    </Stack>
  );
}
