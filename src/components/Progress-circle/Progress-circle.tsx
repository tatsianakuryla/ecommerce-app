import { ProgressCircle } from '@chakra-ui/react';

export const ProgressCircleElement = () => {
  return (
    <ProgressCircle.Root
      display='flex'
      alignItems='center'
      justifyContent='center'
      position='fixed'
      inset='0'
      zIndex='modal'
      data-testid='progress-circle'
    >
      <ProgressCircle.Circle>
        <ProgressCircle.Track />
        <ProgressCircle.Range strokeLinecap='round' />
      </ProgressCircle.Circle>
    </ProgressCircle.Root>
  );
};
