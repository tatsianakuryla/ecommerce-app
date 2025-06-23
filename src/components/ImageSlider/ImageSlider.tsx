import { useState } from 'react';
import {
  Box,
  Image as ChakraImage,
  IconButton,
  Circle,
  Flex,
} from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { ImageSliderProperties } from '~types/types';
import {
  imageSliderBoxStyle,
  sliderIconStyle,
  sliderImageStyle,
  sliderWrapper,
} from '~/styles/style';

export const ImageSlider = ({
  images,
  boxHeight = '400px',
  boxWidth = '100%',
  maxHeight,
}: ImageSliderProperties) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <Box h={boxHeight} w={boxWidth} maxH={maxHeight} {...imageSliderBoxStyle}>
        There is no images yet.
      </Box>
    );
  }

  if (images.length === 1) {
    return (
      <Box h={boxHeight} w={boxWidth} position='relative' maxH={maxHeight}>
        <ChakraImage
          src={images[0].url}
          alt={images[0].alt || `Image 1`}
          {...sliderImageStyle}
        />
      </Box>
    );
  }

  const showPrevious = () => {
    setCurrentIndex((previous) =>
      previous - 1 < 0 ? images.length - 1 : previous - 1,
    );
  };

  const showNext = () => {
    setCurrentIndex((previous) =>
      previous + 1 >= images.length ? 0 : previous + 1,
    );
  };

  const showIndex = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <Box
      h={boxHeight}
      w={boxWidth}
      maxH={maxHeight}
      position='relative'
      overflow='hidden'
      borderRadius='md'
    >
      <IconButton
        {...sliderIconStyle}
        size='sm'
        aria-label='Previous image'
        onClick={showPrevious}
        left={2}
      >
        <FiChevronLeft color='black' size='24px' />
      </IconButton>

      <ChakraImage
        src={images[currentIndex].url}
        alt={images[currentIndex].alt || `Image ${currentIndex + 1}`}
        {...sliderImageStyle}
      />

      <IconButton
        onClick={showNext}
        aria-label='Next image'
        size='sm'
        {...sliderIconStyle}
        right={2}
      >
        <FiChevronRight color='black' size='24px' />
      </IconButton>

      <Flex {...sliderWrapper}>
        {images.map((_, index) => (
          <Circle
            key={index}
            size='10px'
            bg={index === currentIndex ? 'blue.500' : 'gray.300'}
            cursor='pointer'
            onClick={() => {
              showIndex(index);
            }}
          />
        ))}
      </Flex>
    </Box>
  );
};
