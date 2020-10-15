import React from 'react';
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
  DotGroup,
} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

// Icons
import { ChevronLeft, ChevronRight } from '@material-ui/icons';

// Custom CSS
import styles from 'common/ImageCarousel.module.css';

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

  return (
    <CarouselProvider
      isPlaying={autoPlay}
      naturalSlideWidth={width}
      naturalSlideHeight={height}
      totalSlides={slides.length}
      style={{ backgroundColor: 'transparent' }}
    >
      <Box position={'relative'}>
        <Slider>
          {slides.map((slide, idx) => (
            <Slide key={`${keyName}-slide-${idx}`} index={idx}>
              {slide}
            </Slide>
          ))}
        </Slider>
        {slides && slides.length > 1 && (
          <>
            <BackSlideControl>
              <ChevronLeft fontSize="large" />
            </BackSlideControl>
            <NextSlideControl>
              <ChevronRight fontSize="large" />
            </NextSlideControl>
          </>
        )}
      </Box>
      {dots && (
        <Box p={1} display="flex" justifyContent="center" alignItems="center">
          <DotGroup
            showAsSelectedForCurrentSlideOnly
            className={styles.dotGroup}
          />
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
