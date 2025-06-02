import {
  Stack,
  Heading,
  Text,
  Input,
  HStack,
  Button,
  Icon,
} from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { FiUser } from 'react-icons/fi';
import { ErrorAlert } from '~components/ErrorAlert/ErrorAlert';
import { PersonalInfoProperties } from '~types/types.ts';

export function PersonalInfo({
  isEditing,
  editData,
  errors,
  profileData,
  onEmailChange,
  onFirstNameChange,
  onLastNameChange,
  onDateOfBirthChange,
  onToggleEdit,
  onSave,
  hasErrors,
}: PersonalInfoProperties) {
  return (
    <>
      <Heading size='md' mb='1rem'>
        <HStack>
          <Icon as={FiUser} boxSize={6} color='teal.500' />
          <Text>Personal Information</Text>
          <HStack ml='auto'>
            {isEditing ? (
              <>
                <Button size='sm' onClick={onToggleEdit}>
                  Cancel
                </Button>
                <Button
                  size='sm'
                  colorScheme='teal'
                  onClick={onSave}
                  disabled={hasErrors}
                >
                  Save
                </Button>
              </>
            ) : (
              <Button size='sm' onClick={onToggleEdit}>
                Edit
              </Button>
            )}
          </HStack>
        </HStack>
      </Heading>

      {isEditing ? (
        <Stack gap='1rem'>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor='email'>Email</FormLabel>
            <Input
              id='email'
              value={editData.email}
              onChange={(event) => {
                onEmailChange(event.target.value);
              }}
            />
            {errors.email && <ErrorAlert name='email' error={errors.email} />}
          </FormControl>

          <FormControl isInvalid={!!errors.firstName}>
            <FormLabel htmlFor='firstName'>First Name</FormLabel>
            <Input
              id='firstName'
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
            <FormLabel htmlFor='lastName'>Last Name</FormLabel>
            <Input
              id='lastName'
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
            <FormLabel htmlFor='dateOfBirth'>Date of Birth</FormLabel>
            <Input
              id='dateOfBirth'
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
            <strong>Email:</strong> {profileData.email}
          </Text>
          <Text>
            <strong>First Name:</strong>{' '}
            {profileData.firstName ? profileData.firstName : '—'}
          </Text>
          <Text>
            <strong>Last Name:</strong>{' '}
            {profileData.lastName ? profileData.lastName : '—'}
          </Text>
          <Text>
            <strong>Date of Birth:</strong>{' '}
            {profileData.dateOfBirth
              ? new Date(profileData.dateOfBirth).toLocaleDateString()
              : '—'}
          </Text>
        </Stack>
      )}
    </>
  );
}
