import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box } from '@material-ui/core';
import {
  CarouselContext,
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  Image,
  Dot,
} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { PRODUCT_BASE_URL } from 'config';

// Icons
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
export default function ImageCarousel({
  imageRefs,
  ingredientLabels,
  name,
  nutritionFacts,
  productId,
  ...props
}) {
  var slides = imageRefs;
  if (nutritionFacts) slides = [...slides, ...nutritionFacts];
  if (ingredientLabels) slides = [...slides, ...ingredientLabels];

  // Only allow 5 slides
  slides = slides.slice(0, 6);

  return (
    <CarouselProvider
      naturalSlideWidth={362}
      naturalSlideHeight={362}
      totalSlides={slides.length}
      style={{ backgroundColor: 'transparent' }}
    >
      <Slides productId={productId} slides={slides} />
    </CarouselProvider>
  );
}

const BackSlideControl = styled(ButtonBack)`
  position: absolute;
  top: calc(50% - 24px);
  left: 0;
  border-radius: 50%;
  padding: 1rem;
  -webkit-appearance: none;
  background: rgba(0, 0, 0, 0.2);
  border: none;
  height: 48px;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NextSlideControl = styled(ButtonNext)`
  position: absolute;
  top: calc(50% - 24px);
  right: 0;
  border-radius: 50%;
  padding: 1rem;
  -webkit-appearance: none;
  background: rgba(0, 0, 0, 0.2);
  border: none;
  height: 48px;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Thumbnail = styled(Dot)`
  &&& {
    border: 1px solid #97adff;
    -webkit-appearance: none;
    padding: 0;
  }
`;

function Slides({ productId, slides }) {
  const carouselContext = useContext(CarouselContext);
  const [currentSlide, setCurrentSlide] = useState(
    carouselContext.state.currentSlide,
  );

  useEffect(() => {
    function onChange() {
      setCurrentSlide(carouselContext.state.currentSlide);
    }
    carouselContext.subscribe(onChange);
    return () => carouselContext.unsubscribe(onChange);
  }, [carouselContext]);

  return (
    <Box position={'relative'}>
      <Slider>
        {slides.map((imgRef, idx) => {
          const src = PRODUCT_BASE_URL + productId + '/' + imgRef;
          return (
            <Slide key={imgRef} index={idx}>
              <Image src={src} alt={name} />
            </Slide>
          );
        })}
      </Slider>
      <BackSlideControl>
        <ChevronLeft fontSize="large" />
      </BackSlideControl>
      <NextSlideControl>
        <ChevronRight fontSize="large" />
      </NextSlideControl>
      <Box p={1} display="flex">
        {slides.map((imgRef, idx) => {
          const src = PRODUCT_BASE_URL + productId + '/' + imgRef;
          return (
            <Box p={1} flex="20%" flexGrow={0} flexShrink={0}>
              <Thumbnail slide={idx}>
                <Image src={src} alt={name} />
              </Thumbnail>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
