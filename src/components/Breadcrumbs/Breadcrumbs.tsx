import { Breadcrumb } from '@chakra-ui/react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Category, ILocales } from '~/types/types';
import { locales } from '~/constants/constants';

interface BreadcrumbsProperties {
  currentCategory: Category;
  allCategories: Category[];
  locale?: ILocales[keyof ILocales];
}

export const Breadcrumbs = ({
  currentCategory,
  allCategories,
  locale = locales.UK,
}: BreadcrumbsProperties) => {
  const buildTrail = (): Category[] => {
    const trail: Category[] = [];
    currentCategory.ancestors.forEach((reference) => {
      const cat = allCategories.find((c) => c.id === reference.id);
      if (cat) trail.push(cat);
    });
    trail.push(currentCategory);
    return trail;
  };

  const trail = buildTrail();

  return (
    <Breadcrumb.Root mb='1rem'>
      <Breadcrumb.List gap='8px'>
        <Breadcrumb.Item>
          <Breadcrumb.Link asChild>
            <Link to='/'>Catalog</Link>
          </Breadcrumb.Link>
        </Breadcrumb.Item>

        {trail.map((category, index) => {
          const isLast = index === trail.length - 1;
          const to = `/catalog/category/${category.id}`;

          return (
            <Breadcrumb.Item key={category.id}>
              {isLast ? (
                <Breadcrumb.Link asChild>
                  <span style={{ fontWeight: '600' }}>
                    {category.name[locale]}
                  </span>
                </Breadcrumb.Link>
              ) : (
                <>
                  <Breadcrumb.Link asChild>
                    <Link to={to}>{category.name[locale]}</Link>
                  </Breadcrumb.Link>
                  <Breadcrumb.Separator>
                    <FiChevronRight color='gray.500' />
                  </Breadcrumb.Separator>
                </>
              )}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
};
