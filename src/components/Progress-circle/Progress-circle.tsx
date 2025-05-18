import { ProgressCircle } from '@chakra-ui/react';

export const ProgressCircleElement = () => {
  return (
    <ProgressCircle.Root
      value={null}
      pos='absolute'
      data-testid='progress-circle'
    >
      <ProgressCircle.Circle>
        <ProgressCircle.Track />
        <ProgressCircle.Range strokeLinecap='round' />
      </ProgressCircle.Circle>
    </ProgressCircle.Root>
  );
};
