import {
  Box,
  Button,
  Container,
  Dialog,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Input,
  Link as ChakraLink,
  NumberInput,
  Separator,
  Stack,
  Text,
  VisuallyHidden,
} from '@chakra-ui/react';
import Toastify from 'toastify-js';
import { FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '~/contexts/cartContext';
import { locales, PROMO_DISCOUNTS_RATE } from '~/constants/constants';
import { formatPrice } from '~/utils/helpers';

const locale = locales.UK;

/* ------------------------------------------------------------------ */
/* вспомогалки                                                         */
/* ------------------------------------------------------------------ */

const priceStyles = { fontWeight: 'bold', fontSize: 'lg' };

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

/* ------------------------------------------------------------------ */
/* карточка товара в корзине                                           */
/* ------------------------------------------------------------------ */

type BasketItemProperties = {
  id: string;
  name: string;
  image: string;
  price: string;
  quantity: number;
  lineTotal: string;
};

function BasketItem({
  id,
  name,
  image,
  price,
  quantity,
  lineTotal,
}: BasketItemProperties) {
  const { updateLineItemQuantity, removeFromCart, loading } = useCart();

  return (
    <GridItem p={4} borderWidth='1px' borderRadius='md' shadow='sm'>
      <HStack align='flex-start' gap={4}>
        <Image src={image} alt={name} boxSize='80px' objectFit='cover' />

        <Box flex='1'>
          <Text fontWeight='semibold'>{name}</Text>
          <Text fontSize='sm' color='gray.500'>
            {price}
          </Text>

          <HStack mt={2} gap={4}>
            <NumberInput.Root
              value={String(quantity)}
              min={1}
              maxW='90px'
              size='sm'
              disabled={loading}
              onValueChange={({ valueAsNumber }) => {
                if (!Number.isNaN(valueAsNumber)) {
                  updateLineItemQuantity(id, valueAsNumber).catch(() => {
                    showError('Failed to update quantity');
                  });
                }
              }}
            >
              <NumberInput.Control>
                <NumberInput.DecrementTrigger aria-label='decrease' />
                <NumberInput.Input />
                <NumberInput.IncrementTrigger aria-label='increase' />
              </NumberInput.Control>
            </NumberInput.Root>

            <Text fontSize='sm' color='gray.500'>
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
              Remove <FiTrash2 />
            </Button>
          </HStack>
        </Box>
      </HStack>
    </GridItem>
  );
}

/* ------------------------------------------------------------------ */
/* основная страница корзины                                           */
/* ------------------------------------------------------------------ */

export function BasketPage() {
  const { cart, clearCart, applyDiscountCode, appliedCode, loading } =
    useCart();
  const [promo, setPromo] = useState('');

  /* ——— пустая корзина ——— */
  if (!cart || cart.lineItems.length === 0) {
    return (
      <Container py='6'>
        <Heading size='md' mb='4'>
          Looks like your cart is empty ☺️
        </Heading>
        <ChakraLink asChild color='teal.500' fontWeight='semibold'>
          <Link to='/'>Browse our catalog and find something you love!</Link>
        </ChakraLink>
      </Container>
    );
  }

  /* ——— расчёты ——— */
  const subTotal = cart.lineItems.reduce(
    (sum, li) => sum + li.totalPrice.centAmount,
    0,
  );
  const discountRate = appliedCode
    ? (PROMO_DISCOUNTS_RATE[appliedCode] ?? 0)
    : 0;
  const discountValue = Math.round(subTotal * discountRate);
  const total = subTotal - discountValue;
  const currency = cart.lineItems.at(0)?.price.value.currencyCode ?? 'EUR';

  /* ——— JSX ——— */
  return (
    <Container maxW='container.lg' py='6'>
      <VisuallyHidden>
        <Heading>Shopping cart</Heading>
      </VisuallyHidden>

      <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={8}>
        {/* список товаров */}
        <Box>
          <Heading size='md' mb='4'>
            Items in cart
          </Heading>
          <Grid gap={4}>
            {cart.lineItems.map((li) => (
              <BasketItem
                key={li.id}
                id={li.id}
                name={li.name[locale]}
                image={li.variant?.images?.[0]?.url ?? ''}
                price={formatPrice(li.price.value.centAmount, currency, locale)}
                lineTotal={formatPrice(
                  li.totalPrice.centAmount,
                  currency,
                  locale,
                )}
                quantity={li.quantity}
              />
            ))}
          </Grid>
        </Box>

        {/* сводка */}
        <Stack gap={4}>
          <Heading size='md'>Summary</Heading>

          <HStack justify='space-between'>
            <Text>Subtotal</Text>
            <Text fontWeight='semibold'>
              {formatPrice(subTotal, currency, locale)}
            </Text>
          </HStack>

          {appliedCode && (
            <>
              <HStack justify='space-between' color='teal.600'>
                <Text>
                  Discount&nbsp;
                  <Text as='span' fontWeight='medium'>
                    ({appliedCode})
                  </Text>
                </Text>
                <Text fontWeight='semibold'>
                  –{formatPrice(discountValue, currency, locale)}
                </Text>
              </HStack>

              <HStack justify='space-between'>
                <Text>Original total</Text>
                <Text
                  {...priceStyles}
                  textDecor='line-through'
                  color='gray.500'
                >
                  {formatPrice(subTotal, currency, locale)}
                </Text>
              </HStack>
            </>
          )}

          <HStack justify='space-between'>
            <Text fontWeight='bold'>Total now</Text>
            <Text {...priceStyles} color={appliedCode ? 'teal.600' : undefined}>
              {formatPrice(total, currency, locale)}
            </Text>
          </HStack>

          <HStack>
            <Input
              placeholder='Promo code'
              value={promo}
              disabled={loading}
              onChange={(event) => {
                setPromo(event.target.value);
              }}
            />
            <Button
              disabled={!promo}
              loading={loading}
              onClick={() => {
                applyDiscountCode(promo);
              }}
            >
              Apply
            </Button>
          </HStack>

          <Separator />

          {/* ───── одна-единственная кнопка, обёрнутая в Dialog.Trigger ───── */}
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button
                colorScheme='red'
                variant='outline'
                disabled={loading || cart.lineItems.length === 0}
                width='100%'
              >
                Clear cart
              </Button>
            </Dialog.Trigger>

            <Dialog.Backdrop />

            <Dialog.Positioner>
              <Dialog.Content maxW='xs'>
                <Dialog.CloseTrigger asChild>
                  <Button
                    position='absolute'
                    top={2}
                    right={2}
                    size='sm'
                    variant='ghost'
                    aria-label='Close'
                  >
                    ✕
                  </Button>
                </Dialog.CloseTrigger>

                <Dialog.Header>Remove all items?</Dialog.Header>

                <Dialog.Body>
                  This action can’t be undone. All products will be removed from
                  your cart.
                </Dialog.Body>

                <Dialog.Footer gap={3}>
                  <Dialog.CloseTrigger asChild>
                    <Button flex='1'>Cancel</Button>
                  </Dialog.CloseTrigger>

                  <Dialog.CloseTrigger asChild>
                    <Button
                      flex='1'
                      colorScheme='red'
                      loading={loading}
                      onClick={() => void clearCart()}
                    >
                      Yes, clear
                    </Button>
                  </Dialog.CloseTrigger>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>
        </Stack>
      </Grid>
    </Container>
  );
}
