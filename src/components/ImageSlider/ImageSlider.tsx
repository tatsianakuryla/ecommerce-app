import { useState } from 'react';
import {
  Box,
  Image as ChakraImage,
  IconButton,
  Circle,
  Flex,
} from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ImageSliderProperties {
  images: Array<{ url: string; alt?: string }>;
  boxHeight?: string | number;
  boxWidth?: string | number;
  maxHeight?: string | number;
}

export const ImageSlider = ({
  images,
  boxHeight = '400px',
  boxWidth = '100%',
  maxHeight,
}: ImageSliderProperties) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <Box
        h={boxHeight}
        w={boxWidth}
        maxH={maxHeight}
        bg='gray.100'
        borderRadius='md'
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        Нет изображений
      </Box>
    );
  }

  if (images.length === 1) {
    return (
      <Box h={boxHeight} w={boxWidth} position='relative' maxH={maxHeight}>
        <ChakraImage
          src={images[0].url}
          alt={images[0].alt || `Image 1`}
          objectFit='contain'
          h='100%'
          w='100%'
          borderRadius='md'
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
      position='relative'
      overflow='hidden'
      maxH={maxHeight}
      borderRadius='md'
    >
      <IconButton
        aria-label='Previous image'
        position='absolute'
        top='50%'
        left='2'
        transform='translateY(-50%)'
        zIndex={2}
        size='sm'
        bg='rgba(255,255,255,0.7)'
        _hover={{ bg: 'rgba(255,255,255,0.9)' }}
        onClick={showPrevious}
      >
        <FiChevronLeft color='black' size='24px' />
      </IconButton>

      <ChakraImage
        src={images[currentIndex].url}
        alt={images[currentIndex].alt || `Image ${currentIndex + 1}`}
        objectFit='contain'
        h='100%'
        w='100%'
      />

      <IconButton
        aria-label='Next image'
        position='absolute'
        top='50%'
        right='2'
        transform='translateY(-50%)'
        zIndex={2}
        size='sm'
        bg='rgba(255,255,255,0.7)'
        _hover={{ bg: 'rgba(255,255,255,0.9)' }}
        onClick={showNext}
      >
        <FiChevronRight color='black' size='24px' />
      </IconButton>

      <Flex
        position='absolute'
        bottom='2'
        left='50%'
        transform='translateX(-50%)'
        gap='2'
      >
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
