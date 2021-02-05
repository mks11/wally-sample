import React from 'react';

// Custom Components
import ImageCarousel from 'common/ImageCarousel';

// Material UI
import { Box } from '@material-ui/core';

// React Responsive
import { useMediaQuery } from 'react-responsive';

// Slides
import slides, { HAS_DOTS } from './slides';

function Hero() {
  const isXs = useMediaQuery({ query: '(max-width: 480px)' });

  return (
    <Box my={2} zIndex={1}>
      {isXs ? (
        <ImageCarousel
          dots={HAS_DOTS}
          keyName={'featured-brands'}
          height={480}
          slides={slides}
          width={480}
        />
      ) : (
        <ImageCarousel
          dots={HAS_DOTS}
          keyName={'featured-brands'}
          height={675}
          slides={slides}
          width={1200}
        />
      )}
    </Box>
  );
}

export default Hero;
