import { ProgressCircle } from '@chakra-ui/react';

export const ProgressCircleElement = () => {
  return (
    <ProgressCircle.Root
      pos='absolute'
      data-testid='progress-circle'
      value={null}
    >
      <ProgressCircle.Circle>
        <ProgressCircle.Track />
        <ProgressCircle.Range strokeLinecap='round' />
      </ProgressCircle.Circle>
    </ProgressCircle.Root>
  );
};
