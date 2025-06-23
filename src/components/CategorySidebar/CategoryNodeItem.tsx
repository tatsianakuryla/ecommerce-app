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
import { Properties } from '~/types/types';
import {
  categoryBoxStyle,
  categoryItemWrapperStyle,
  categoryLinkStyle,
  iconButtonStyle,
  nestedChildrenWrapperStyle,
} from '~/styles/style';

export const CategoryNodeItem = ({ node, locale }: Properties) => {
  const [isOpen, setOpen] = useState(false);
  const location = useLocation();
  const to = `/catalog/category/${node.id}`;

  return (
    <Box {...categoryBoxStyle}>
      <VStack {...categoryItemWrapperStyle}>
        <Box display='flex' alignItems='center'>
          {node.children.length > 0 && (
            <IconButton
              aria-label={isOpen ? 'Collapse' : 'Expand'}
              onClick={() => {
                setOpen(!isOpen);
              }}
              {...iconButtonStyle}
              variant='ghost'
              size='xs'
            >
              {isOpen ? (
                <FiChevronLeft size='18px' />
              ) : (
                <FiChevronRight size='18px' />
              )}
            </IconButton>
          )}
          <ChakraLink asChild {...categoryLinkStyle(location.pathname === to)}>
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
              <VStack {...nestedChildrenWrapperStyle}>
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
