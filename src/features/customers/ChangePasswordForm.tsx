import { useState } from 'react';
import { Stack, Input, Button, Box } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import Toastify from 'toastify-js';

import { useAuthContext } from '~hooks/useAuthContext';
import {
  validatePassword,
  validateConfirmPassword,
} from '~components/Form/RegistrationForm/registrationFormValidation';
import { profileToastifyOptions } from '~/styles/style';
import { ErrorAlert } from '~components/ErrorAlert/ErrorAlert';

export function ChangePasswordForm({ onClose }: { onClose: () => void }) {
  const { accessToken, updatePassword, customer } = useAuthContext();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (!accessToken || !customer) return;

    const currentError = currentPassword.trim()
      ? ''
      : 'Current password is required.';
    const passwordError = validatePassword(newPassword);
    const confirmError = validateConfirmPassword(newPassword, confirmPassword);

    setCurrentPasswordError(currentError);
    setNewPasswordError(passwordError);
    setConfirmPasswordError(confirmError);

    if (currentError || passwordError || confirmError) return;

    setLoading(true);
    setGeneralError('');

    try {
      await updatePassword(
        customer.id,
        customer.version,
        currentPassword,
        newPassword,
      );

      Toastify({
        ...profileToastifyOptions,
        text: 'Password changed successfully',
      }).showToast();

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch {
      setGeneralError('Current password is incorrect or update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box border='1px solid #ccc' borderRadius='md' p='1.5rem'>
      <Stack gap={4}>
        <FormControl isInvalid={!!currentPasswordError}>
          <FormLabel>Current Password</FormLabel>
          <Input
            type='password'
            value={currentPassword}
            onChange={(event) => {
              const value = event.target.value;
              setCurrentPassword(value);
              setCurrentPasswordError(
                value.trim() ? '' : 'Current password is required.',
              );
            }}
          />
          {currentPasswordError && (
            <ErrorAlert name='current-password' error={currentPasswordError} />
          )}
        </FormControl>

        <FormControl isInvalid={!!newPasswordError}>
          <FormLabel>New Password</FormLabel>
          <Input
            type='password'
            value={newPassword}
            onChange={(event) => {
              const value = event.target.value;
              setNewPassword(value);
              setNewPasswordError(validatePassword(value));
            }}
          />
          {newPasswordError && (
            <ErrorAlert name='new-password' error={newPasswordError} />
          )}
        </FormControl>

        <FormControl isInvalid={!!confirmPasswordError}>
          <FormLabel>Confirm New Password</FormLabel>
          <Input
            type='password'
            value={confirmPassword}
            onChange={(event) => {
              const value = event.target.value;
              setConfirmPassword(value);
              setConfirmPasswordError(
                validateConfirmPassword(newPassword, value),
              );
            }}
          />
          {confirmPasswordError && (
            <ErrorAlert name='confirm-password' error={confirmPasswordError} />
          )}
        </FormControl>

        {generalError && <ErrorAlert name='general' error={generalError} />}

        <Stack direction='row' justifyContent='flex-end'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme='purple'
            onClick={() => void handlePasswordChange()}
            loading={loading}
          >
            Save
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
