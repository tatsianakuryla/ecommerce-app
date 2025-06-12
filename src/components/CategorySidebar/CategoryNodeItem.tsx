import {
  Box,
  VStack,
  IconButton,
  Link as ChakraLink,
  Collapsible,
} from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Category, ILocales } from '~/types/types';

interface CategoryNode extends Category {
  children: CategoryNode[];
}

interface Properties {
  node: CategoryNode;
  locale: ILocales[keyof ILocales];
}

export const CategoryNodeItem = ({ node, locale }: Properties) => {
  const [isOpen, setOpen] = useState(false);
  const location = useLocation();
  const to = `/catalog/category/${node.id}`;

  return (
    <Box pl='1rem' w='100%'>
      <VStack align='start' gap={1}>
        <Box display='flex' alignItems='center'>
          {node.children.length > 0 && (
            <IconButton
              aria-label={isOpen ? 'Свернуть' : 'Развернуть'}
              size='xs'
              variant='ghost'
              onClick={() => {
                setOpen(!isOpen);
              }}
              mr='0.25rem'
            >
              {isOpen ? (
                <FiChevronLeft color='black' size='18px' />
              ) : (
                <FiChevronRight color='black' size='18px' />
              )}
            </IconButton>
          )}
          <ChakraLink
            asChild
            fontWeight={location.pathname === to ? 'bold' : 'normal'}
          >
            <Link to={to}>{node.name[locale] || node.slug[locale]}</Link>
          </ChakraLink>
        </Box>

        {node.children.length > 0 && (
          <Collapsible.Root
            open={isOpen}
            onOpenChange={(details) => {
              setOpen(details.open);
            }}
          >
            <Collapsible.Content>
              <VStack align='start' gap={0}>
                {node.children.map((child) => (
                  <CategoryNodeItem
                    key={child.id}
                    node={child}
                    locale={locale}
                  />
                ))}
              </VStack>
            </Collapsible.Content>
          </Collapsible.Root>
        )}
      </VStack>
    </Box>
  );
};
