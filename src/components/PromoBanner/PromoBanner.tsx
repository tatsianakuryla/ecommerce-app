import { useState } from 'react';
import { Box, HStack, Tag, Text } from '@chakra-ui/react';
import { promoCodes } from '~constants/constants';

export default function PromoBanner() {
  const [codes] = useState<string[]>(promoCodes);

  if (codes.length === 0) return null;

  return (
    <Box bg='teal.50' p={3} mb={4} borderRadius='lg'>
      <Text mb={2} fontWeight='medium'>
        💡 Active promo codes:
      </Text>

      <HStack wrap='wrap' gap={2}>
        {codes.map((code) => (
          <Tag.Root
            key={code}
            size='lg'
            colorScheme='teal'
            cursor='copy'
            onClick={() => void navigator.clipboard.writeText(code)}
          >
            <Tag.Label>{code}</Tag.Label>
          </Tag.Root>
        ))}
      </HStack>

      <Text fontSize='xs' mt={2} color='gray.600'>
        Click a code to copy – then paste it in your cart!
      </Text>
    </Box>
  );
}
