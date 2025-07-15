import { BasketItemProperties } from '~types/types';
import { useCart } from '~hooks/useCart';
import {
  Box,
  Button,
  Flex,
  GridItem,
  Image,
  NumberInput,
  Text,
} from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';
import Toastify from 'toastify-js';
import { basketFlexBoxStyle, basketGridImenStyle } from '~/styles/style.ts';

function showError(text: string) {
  Toastify({
    text,
    duration: 3000,
    close: true,
    gravity: 'top',
    position: 'right',
    style: { background: '#E53E3E', color: '#fff' },
  }).showToast();
}

export function BasketItem({
  id,
  name,
  image,
  price,
  quantity,
  lineTotal,
}: BasketItemProperties) {
  const { updateLineItemQuantity, removeFromCart, loading } = useCart();

  return (
    <GridItem {...basketGridImenStyle}>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        align={{ base: 'stretch', lg: 'center' }}
        gap={4}
      >
        <Box flexShrink={0} textAlign={{ base: 'left', lg: 'center' }}>
          <Image
            src={image}
            alt={name}
            boxSize={{ base: '60px', md: '80px' }}
            objectFit='cover'
            borderRadius='md'
          />
          <Flex
            mt={2}
            direction='column'
            align={{ base: 'flex-start', lg: 'center' }}
          >
            <Text fontWeight='semibold' fontSize='md' lineClamp={2}>
              {name}
            </Text>
            <Text fontSize='sm' color='gray.500'>
              {price}
            </Text>
          </Flex>
        </Box>

        <Flex {...basketFlexBoxStyle}>
          <NumberInput.Root
            value={String(quantity)}
            min={1}
            size='sm'
            w={{ base: '100px', md: '180px' }}
            disabled={loading}
            onValueChange={({ valueAsNumber }) => {
              if (!Number.isNaN(valueAsNumber)) {
                updateLineItemQuantity(id, valueAsNumber).catch(() => {
                  showError('Failed to update quantity');
                });
              }
            }}
          >
            <NumberInput.Control w='60px' />
            <NumberInput.Input />
          </NumberInput.Root>

          <Text fontSize='sm' color='gray.600'>
            {price} × {quantity}
          </Text>

          <Text fontWeight='semibold'>{lineTotal}</Text>

          <Button
            size='sm'
            variant='ghost'
            colorScheme='red'
            disabled={loading}
            onClick={() => void removeFromCart(id)}
          >
            {<FiTrash2 />}
          </Button>
        </Flex>
      </Flex>
    </GridItem>
  );
}
