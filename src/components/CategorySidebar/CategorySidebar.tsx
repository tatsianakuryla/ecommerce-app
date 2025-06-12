import { Box, VStack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useMakeRequest } from '~/hooks/useMakeRequest';
import { getCategories } from '~/api/requests';
import { isCategoriesResponse } from '~/utils/typeguards';
import { Category, ILocales } from '~/types/types';
import { locales } from '~/constants/constants';
import { CategoryNodeItem } from '~/components/CategorySidebar/CategoryNodeItem';

interface CategoryNode extends Category {
  children: CategoryNode[];
}

export const CategorySidebar = ({
  token,
  locale = locales.UK,
}: {
  token: string;
  locale?: ILocales[keyof ILocales];
}) => {
  const { makeRequest, loading, error } = useMakeRequest();
  const [tree, setTree] = useState<CategoryNode[]>([]);

  useEffect(() => {
    if (!token) return;
    let ignore = false;

    const fetchCategories = async () => {
      try {
        const resp = await makeRequest(
          getCategories(token),
          isCategoriesResponse,
        );
        if (!ignore && resp) {
          const categories = resp.results;

          const nodeMap: Record<string, CategoryNode> = {};
          categories.forEach((cat) => {
            nodeMap[cat.id] = { ...cat, children: [] };
          });

          const roots: CategoryNode[] = [];
          categories.forEach((cat) => {
            if (cat.parent) {
              nodeMap[cat.parent.id].children.push(nodeMap[cat.id]);
            } else {
              roots.push(nodeMap[cat.id]);
            }
          });

          setTree(roots);
        }
      } catch {}
    };

    void fetchCategories();
    return () => {
      ignore = true;
    };
  }, [makeRequest, token]);

  return (
    <Box
      as='aside'
      w='250px'
      p='1rem'
      borderWidth='1px'
      borderRadius='md'
      overflowY='auto'
      maxH='80vh'
    >
      <Text fontSize='lg' mb='0.5rem' fontWeight='semibold'>
        Categories
      </Text>
      {loading && <Text>Loading...</Text>}
      {error && <Text color='red.500'>Error: {error}</Text>}
      {!loading && !error && tree.length === 0 && (
        <Text>There is no categories</Text>
      )}
      <VStack align='start' gap={1}>
        {tree.map((root) => (
          <CategoryNodeItem key={root.id} node={root} locale={locale} />
        ))}
      </VStack>
    </Box>
  );
};
