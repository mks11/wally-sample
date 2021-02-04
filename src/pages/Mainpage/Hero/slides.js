import React from 'react';

// Icons
import { ArrowForwardIcon } from 'Icons';

// Material UI
import { Box, Typography } from '@material-ui/core';
import theme from 'mui-theme';

// Prop Types
import PropTypes from 'prop-types';

// Pure React Carousel
import { Image } from 'pure-react-carousel';

// Styled Components
import styled from 'styled-components';
import { PrimaryTextLink } from 'styled-component-lib/Links';

const SlideOverlayWrapper = styled(Box)`
  @media only screen and (min-width: 992px) {
    padding: 2rem;
  }

  padding: 1rem;
`;

function HeroSlideOverlay({ children, justify }) {
  return (
    <SlideOverlayWrapper
      position="absolute"
      top="0"
      left="0"
      width="100%"
      height="100%"
      maxHeight="100%"
      overflow="hidden"
    >
      {children && children}
    </SlideOverlayWrapper>
  );
}

HeroSlideOverlay.propTypes = {
  children: PropTypes.node,
  justify: PropTypes.string,
};

const LargeHeroImage = styled(Image)`
  && {
    @media only screen and (max-width: 768px) {
      display: none;
    }
  }
`;

const MediumHeroImage = styled(Image)`
  && {
    @media only screen and (min-width: 481px) and (max-width: 768px) {
      display: block;
    }

    display: none;
  }
`;

const SmallHeroImage = styled(Image)`
  && {
    @media only screen and (min-width: 481px) {
      display: none;
    }
  }
`;

function HeroSlide({ alt, children, justify, srcLg, srcMd, srcSm }) {
  return (
    <Box position="relative">
      <LargeHeroImage src={srcLg} alt={alt} />
      <MediumHeroImage src={srcMd} alt={alt} />
      <SmallHeroImage src={srcSm} alt={alt} />
      <HeroSlideOverlay justify={justify}>{children}</HeroSlideOverlay>
    </Box>
  );
}

HeroSlide.propTypes = {
  alt: PropTypes.string,
  body: PropTypes.string,
  justify: PropTypes.string,
  srcLg: PropTypes.string.isRequired,
  srcMd: PropTypes.string.isRequired,
  srcSm: PropTypes.string.isRequired,
};

const HeroBodyWrapper = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  ${'' /* max-width: 325px; */}
  ${'' /* padding: 1.5rem; */}
  position: absolute;

  @media only screen and (min-width: 481px) {
    justify-content: center;
  }
`;

const HeroOverline = styled.p`
  font-family: 'Sofia Pro', sans-serif;
  font-weight: bold;
  font-size: 1.125rem;
  color: #000;

  @media only screen and (min-width: 768px) {
    font-size: 1.266rem;
  }
  @media only screen and (min-width: 992px) {
    font-size: 1.424rem;
  }

  margin-bottom: 0;
`;

const HeroTitle = styled.h1`
  font-family: 'Clearface', serif;
  font-size: 1.266rem;
  color: #000;

  @media only screen and (min-width: 768px) {
    font-size: 1.424rem;
  }
  @media only screen and (min-width: 992px) {
    font-size: 1.602rem;
  }

  margin-bottom: 0.75rem;
`;

const HeroBody = styled(Typography)`
  color: #000;
`;

const FBWPageLink = styled(PrimaryTextLink)`
  background-color: ${theme.palette.primary.main};
  color: ${theme.palette.white.main};
  &&& {
    &:hover {
      color: ${theme.palette.white.dark};
    }
  }

  font-size: 1rem;
  font-weight: bold;
  padding: 0.7rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 135px;
`;

// Hero Image Config
const slides = [
  <HeroSlide
    alt="New products from Yaya Maria's announcement."
    justify="flex-start"
    alignItems="center"
    srcLg="https://the-wally-shop-app.s3.us-east-2.amazonaws.com/featured-brand-hero-images/yaya-marias/yaya-maria-1200.jpg"
    srcMd="https://the-wally-shop-app.s3.us-east-2.amazonaws.com/featured-brand-hero-images/yaya-marias/yaya-maria-768.jpg"
    srcSm="https://the-wally-shop-app.s3.us-east-2.amazonaws.com/featured-brand-hero-images/yaya-marias/yaya-maria-480.jpg"
  >
    <HeroBodyWrapper>
      <HeroOverline>Limited Release</HeroOverline>
      <HeroTitle>Soaps by Yaya Maria's</HeroTitle>
      <HeroBody>Sweet lavender hand and dish soap </HeroBody>
      <HeroBody gutterBottom> available now for a limited time.</HeroBody>
      <div>
        <FBWPageLink
          to="/shop/brands/yaya-marias"
          alt="Shop new Yaya Maria's products now!"
        >
          Shop Now <ArrowForwardIcon fontSize="small" />
        </FBWPageLink>
      </div>
    </HeroBodyWrapper>
  </HeroSlide>,
];

export default slides;
export const HAS_DOTS = slides.length > 1;
