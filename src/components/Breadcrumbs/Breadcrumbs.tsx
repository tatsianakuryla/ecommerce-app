import { Breadcrumb } from '@chakra-ui/react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Category, ILocales } from '~/types/types';
import { locales } from '~/constants/constants';
import { Fragment } from 'react/jsx-runtime';

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
      <Breadcrumb.List
        gap='8px'
        display='flex'
        flexWrap='wrap'
        alignItems='center'
      >
        <Breadcrumb.Item>
          <Breadcrumb.Link asChild>
            <Link to='/'>Catalog</Link>
          </Breadcrumb.Link>
        </Breadcrumb.Item>

        {trail.map((category, index) => {
          const isLast = index === trail.length - 1;
          const to = `/catalog/category/${category.id}`;

          return (
            <Fragment key={category.id}>
              <Breadcrumb.Item>
                {isLast ? (
                  <Breadcrumb.Link asChild>
                    <span style={{ fontWeight: '600' }}>
                      {category.name[locale]}
                    </span>
                  </Breadcrumb.Link>
                ) : (
                  <Breadcrumb.Link asChild>
                    <Link to={to}>{category.name[locale]}</Link>
                  </Breadcrumb.Link>
                )}
              </Breadcrumb.Item>

              {!isLast && (
                <Breadcrumb.Separator>
                  <FiChevronRight color='gray.500' />
                </Breadcrumb.Separator>
              )}
            </Fragment>
          );
        })}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
};
