import { HStack, Button, Text } from '@chakra-ui/react';
import { PaginationProperties } from '~types/types';
export const Pagination: React.FC<PaginationProperties> = ({
  currentPage,
  totalPages,
  onChange,
}) => {
  const previousDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <HStack justify='center' gap={4} mt={4}>
      <Button
        onClick={() => {
          onChange(currentPage - 1);
        }}
        disabled={previousDisabled}
      >
        Prev
      </Button>

      <Text>
        Page {currentPage} of {totalPages}
      </Text>

      <Button
        onClick={() => {
          onChange(currentPage + 1);
        }}
        disabled={nextDisabled}
      >
        Next
      </Button>
    </HStack>
  );
};
