import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box } from '@material-ui/core';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  Dot,
} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

// Icons
import { ChevronLeft, ChevronRight } from '@material-ui/icons';

const BackSlideControl = styled(ButtonBack)`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  border-radius: 50%;
  padding: 0;
  -webkit-appearance: none;
  background: rgba(0, 0, 0, 0.2);
  border: none;
  height: 48px;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 992px) {
    display: none;
  }
`;

const NextSlideControl = styled(ButtonNext)`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  border-radius: 50%;
  padding: 0;
  -webkit-appearance: none;
  background: rgba(0, 0, 0, 0.2);
  border: none;
  height: 48px;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 992px) {
    display: none;
  }
`;

const SlideDot = styled(Dot)`
  height: 1rem;
  width: 1rem;
  -webkit-appearance: none;
  border: none;
  border-radius: 50%;
  margin: 0 0.25rem;
`;
export default function ImageCarousel({
  autoPlay,
  dots,
  keyName,
  height,
  slides,
  thumbnails,
  width,
  ...props
}) {
  // Only allow 5 slides
  slides = slides.slice(0, 6);

  const [x, setX] = useState(0);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const minDistance = 0.1 * width;

  // Touch handlers
  const onTouchStart = (e) => {
    const touch = e.touches[0];
    setX(touch.clientX);
  };

  const onTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const xDiff = touch.clientX - x;
    if (xDiff < x && Math.abs(xDiff) >= minDistance) {
      setSelectedSlide(Math.min(slides.length - 1, selectedSlide + 1));
    } else if (xDiff > x && Math.abs(xDiff) >= minDistance) {
      setSelectedSlide(Math.max(0, selectedSlide - 1));
    }
  };

  const handleDotClick = (slide) => {
    setSelectedSlide(slide);
  };

  return (
    <CarouselProvider
      isPlaying={autoPlay}
      naturalSlideWidth={width}
      naturalSlideHeight={height}
      totalSlides={slides.length}
      style={{ backgroundColor: 'transparent' }}
    >
      <Box position={'relative'}>
        <Slider
          trayProps={{
            onTouchStart: onTouchStart,
            onTouchEnd: onTouchEnd,
          }}
        >
          {slides.map((slide, idx) => (
            <Slide key={`${keyName}-slide-${idx}`} index={idx}>
              {slide}
            </Slide>
          ))}
        </Slider>
        {slides && slides.length > 1 && (
          <>
            <BackSlideControl
              onClick={() => handleDotClick(Math.max(0, selectedSlide - 1))}
            >
              <ChevronLeft fontSize="large" />
            </BackSlideControl>
            <NextSlideControl
              onClick={() =>
                handleDotClick(Math.min(slides.length - 1, selectedSlide + 1))
              }
            >
              <ChevronRight fontSize="large" />
            </NextSlideControl>
          </>
        )}
      </Box>
      {dots && (
        <Box p={1} display="flex" justifyContent="center" alignItems="center">
          {slides.map((slide, idx) => {
            const isSelected = selectedSlide === idx;
            return (
              <SlideDot
                key={`${keyName}-dot-${idx}`}
                slide={idx}
                onClick={() => handleDotClick(idx)}
                style={{
                  backgroundColor: isSelected
                    ? 'rgba(0, 0, 0, 0.65)'
                    : 'rgba(0, 0, 0, 0.25)',
                }}
              />
            );
          })}
        </Box>
      )}
      {thumbnails && thumbnails.length > 1 && (
        <ThumbnailSlideControls keyName={keyName} slides={thumbnails} />
      )}
    </CarouselProvider>
  );
}

ImageCarousel.propTypes = {
  autoPlay: PropTypes.bool,
  height: PropTypes.number.isRequired,
  keyName: PropTypes.string.isRequired,
  slides: PropTypes.arrayOf(PropTypes.node.isRequired).isRequired,
  thumbnails: PropTypes.arrayOf(PropTypes.node.isRequired),
  width: PropTypes.number.isRequired,
};

const Thumbnail = styled(Dot)`
  &&& {
    border: 1px solid #97adff;
    -webkit-appearance: none;
    padding: 0;
  }
`;

function ThumbnailSlideControls({ keyName, slides }) {
  return (
    <Box p={1} display="flex">
      {slides.map((slide, idx) => {
        return (
          <Box
            key={`${keyName}-thumbnail-${idx}`}
            p={1}
            flex="20%"
            flexGrow={0}
            flexShrink={0}
          >
            <Thumbnail slide={idx}>{slide}</Thumbnail>
          </Box>
        );
      })}
    </Box>
  );
}

ThumbnailSlideControls.propTypes = {
  keyName: PropTypes.string.isRequired,
  slides: PropTypes.arrayOf(PropTypes.node.isRequired).isRequired,
};
