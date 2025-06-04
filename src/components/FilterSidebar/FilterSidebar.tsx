import {
  Box,
  Checkbox,
  Heading,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from '@chakra-ui/slider';
import { useEffect, useState } from 'react';
import { getFilterValues } from '~/api/requests';
import { useMakeRequest } from '~/hooks/useMakeRequest';
import { CTFacetResponse, FilterSidebarProperties } from '~types/types.ts';
import { isCTFacetResponse } from '~utils/typeguards.ts';

export const FilterSidebar = ({
  token,
  onFilterChange,
}: FilterSidebarProperties) => {
  const { makeRequest, loading: loadingFacets } = useMakeRequest();

  const [brandsOptions, setBrandsOptions] = useState<string[]>([]);
  const [colorsOptions, setColorsOptions] = useState<string[]>([]);
  const [sizesOptions, setSizesOptions] = useState<string[]>([]);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    let ignore = false;

    async function fetchFacet(
      attribute: 'brand' | 'color' | 'size',
    ): Promise<string[]> {
      const request = getFilterValues(token, attribute);
      const json = await makeRequest<CTFacetResponse>(
        request,
        isCTFacetResponse,
      );

      if (ignore || json === undefined) return [];
      const facetKey = `variants.attributes.${attribute}`;
      const facetObject = json.facets[facetKey];
      return facetObject.terms.map((t) => t.term);
    }

    async function loadAllFacets() {
      const [bList, cList, sList] = await Promise.all([
        fetchFacet('brand'),
        fetchFacet('color'),
        fetchFacet('size'),
      ]);
      if (!ignore) {
        setBrandsOptions(bList);
        setColorsOptions(cList);
        setSizesOptions(sList);
      }
    }

    void loadAllFacets();
    return () => {
      ignore = true;
    };
  }, [token, makeRequest]);

  useEffect(() => {
    onFilterChange({
      brands: selectedBrands,
      colors: selectedColors,
      sizes: selectedSizes,
      priceRange,
    });
  }, [
    selectedBrands,
    selectedColors,
    selectedSizes,
    priceRange,
    onFilterChange,
  ]);

  if (loadingFacets) {
    return (
      <Box p='1rem'>
        <Spinner />
      </Box>
    );
  }

  const toggleArrayValue = (array: string[], value: string): string[] => {
    if (array.includes(value)) {
      return array.filter((v) => v !== value);
    } else {
      return [...array, value];
    }
  };

  return (
    <VStack align='stretch' gap={6} p='1rem'>
      <Box>
        <Heading as='h3' size='sm' mb='0.5rem'>
          Brand
        </Heading>
        {brandsOptions.length === 0 ? (
          <Text fontSize='sm' color='gray.500'>
            No brands found
          </Text>
        ) : (
          <Stack gap={1}>
            {brandsOptions.map((brand) => (
              <Checkbox.Root
                key={brand}
                value={brand}
                checked={selectedBrands.includes(brand)}
                onChange={() => {
                  setSelectedBrands((previous) =>
                    toggleArrayValue(previous, brand),
                  );
                }}
                colorScheme='green'
              >
                {brand}
              </Checkbox.Root>
            ))}
          </Stack>
        )}
      </Box>

      <Box>
        <Heading as='h3' size='sm' mb='0.5rem'>
          Color
        </Heading>
        {colorsOptions.length === 0 ? (
          <Text fontSize='sm' color='gray.500'>
            No colors found
          </Text>
        ) : (
          <Stack gap={1}>
            {colorsOptions.map((color) => (
              <Checkbox.Root
                key={color}
                value={color}
                checked={selectedColors.includes(color)}
                onChange={() => {
                  setSelectedColors((previous) =>
                    toggleArrayValue(previous, color),
                  );
                }}
                colorScheme='green'
              >
                {color}
              </Checkbox.Root>
            ))}
          </Stack>
        )}
      </Box>

      <Box>
        <Heading as='h3' size='sm' mb='0.5rem'>
          Size
        </Heading>
        {sizesOptions.length === 0 ? (
          <Text fontSize='sm' color='gray.500'>
            No sizes found
          </Text>
        ) : (
          <Stack gap={1}>
            {sizesOptions.map((size) => (
              <Checkbox.Root
                key={size}
                value={size}
                checked={selectedSizes.includes(size)}
                onChange={() => {
                  setSelectedSizes((previous) =>
                    toggleArrayValue(previous, size),
                  );
                }}
                colorScheme='green'
              >
                {size}
              </Checkbox.Root>
            ))}
          </Stack>
        )}
      </Box>

      <Box>
        <Heading as='h3' size='sm' mb='0.5rem'>
          Price Range: {priceRange[0]} – {priceRange[1]}
        </Heading>
        <RangeSlider
          aria-label={['Min price', 'Max price']}
          min={0}
          max={2000}
          step={10}
          value={priceRange}
          onChange={(vals: [number, number]) => {
            setPriceRange(vals);
          }}
          onChangeEnd={(vals: [number, number]) => {
            setPriceRange(vals);
          }}
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
      </Box>
    </VStack>
  );
};
