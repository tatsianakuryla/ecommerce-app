import {
  Box,
  Button,
  CloseButton,
  Container,
  Dialog,
  Grid,
  Heading,
  HStack,
  Input,
  Link as ChakraLink,
  Portal,
  Stack,
  Text,
  VisuallyHidden,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { locales, PROMO_DISCOUNTS_RATE } from '~constants/constants';
import { formatPrice } from '~utils/helpers';
import { useCart } from '~hooks/useCart';
import { BasketItem } from './BasketItem';

const locale = locales.UK;
const priceStyles = { fontWeight: 'bold', fontSize: 'lg' };

export function BasketPage() {
  const { cart, clearCart, applyDiscountCode, appliedCode, loading } =
    useCart();
  const [promo, setPromo] = useState('');

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

  const subTotal = cart.lineItems.reduce(
    (sum, li) => sum + li.totalPrice.centAmount,
    0,
  );

  const discountRate = appliedCode
    ? (PROMO_DISCOUNTS_RATE[appliedCode] ?? 0)
    : 0;
  const discountValue = Math.round(subTotal * discountRate);
  const total = subTotal - discountValue;

  const currency = cart.lineItems[0].price.value.currencyCode;

  return (
    <Container maxW='container.lg' py='6'>
      <VisuallyHidden>
        <Heading>Shopping cart</Heading>
      </VisuallyHidden>

      <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={8}>
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

          <Dialog.Root placement='top' motionPreset='slide-in-bottom'>
            <Dialog.Trigger asChild>
              <Button
                w='100%'
                colorScheme='red'
                variant='outline'
                disabled={loading}
              >
                Clear cart
              </Button>
            </Dialog.Trigger>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title> Remove all items?</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <p>
                      This action can’t be undone. All products will be removed
                      from your cart.
                    </p>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button variant='outline'>Cancel</Button>
                    </Dialog.ActionTrigger>
                    <Button onClick={() => void clearCart()}>Yes</Button>
                  </Dialog.Footer>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size='sm' />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </Stack>
      </Grid>
    </Container>
  );
}
