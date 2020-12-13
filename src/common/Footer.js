import React from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

// Custom Components
import SubscribeToNewsletter, {
  SubscribeToNewsletterForm,
} from 'common/SubscribeToNewsletter';

// Material UI
import {
  Box,
  Grid,
  Container,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import { Facebook, Instagram } from '@material-ui/icons';

import styled from 'styled-components';

const INSTAGRAM = 'https://www.instagram.com/thewallyshop/';
const FACEBOOK = 'https://facebook.com/thewallyshop';

const FooterContainer = styled.footer`
  padding: 30px 0;
  color: #263a52;
  line-height: 2;
  position: relative;
  a {
    color: #263a52;
    font-size: 16px;
  }
  ul {
    list-style-type: none;
    padding: 0;
    margin-top: 15px;
  }

  @media (min-width: 768px) {
    h4 {
      font-size: 16px;
    }
  }
`;

const FooterSectionHeader = styled(Typography).attrs({
  component: 'p',
  variant: 'h6',
  gutterBottom: true,
})`
  padding-bottom: 0.5rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3px;
    background-color: #263a52;
  }
`;

function Footer() {
  const isXs = useMediaQuery({ query: '(max-width: 566px)' });
  const isLg = useMediaQuery({ query: '(min-width: 992px)' });

  return (
    <FooterContainer>
      <Container maxWidth="xl">
        <Grid container justify="space-evenly" spacing={4}>
          <Grid item xs={12} sm={4} lg={3}>
            <FooterSectionHeader>THE WALLY SHOP</FooterSectionHeader>
            <List>
              <ListItem disableGutters>
                <Link to="about">About</Link>
              </ListItem>
              <ListItem disableGutters>
                <Link to="howitworks">How It Works</Link>
              </ListItem>
              <ListItem disableGutters>
                <Link to="/backers">Our Backers</Link>
              </ListItem>
              <ListItem disableGutters>
                <Link to="/blog">Blog</Link>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={4} lg={3}>
            <FooterSectionHeader>SUPPORT</FooterSectionHeader>
            <List>
              <ListItem disableGutters>
                <a href="mailto:info@thewallyshop.co">Contact Us</a>
              </ListItem>
              <ListItem disableGutters>
                <Link to={'/tnc'}>Terms &amp; Conditions</Link>
              </ListItem>
              <ListItem disableGutters>
                <Link to={'/privacy'}>Privacy Policy</Link>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={4} lg={3}>
            <FooterSectionHeader>FOLLOW US</FooterSectionHeader>
            <List>
              <ListItem disableGutters>
                <a
                  href={FACEBOOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    padding: '0.5rem',
                  }}
                >
                  <Facebook style={{ fontSize: '35px' }} />{' '}
                  <span style={{ marginLeft: '4px' }}>Facebook</span>
                </a>
              </ListItem>
              <ListItem disableGutters>
                <a
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    padding: '0.5rem',
                  }}
                >
                  <Instagram style={{ fontSize: '35px' }} />{' '}
                  <span style={{ marginLeft: '4px' }}>Instagram</span>
                </a>
              </ListItem>
              <ListItem disableGutters>
                <Box display="flex" alignItems="center">
                  <SubscribeToNewsletter />
                </Box>
              </ListItem>
            </List>
          </Grid>
          {(isXs || isLg) && (
            <Grid item xs={12} lg={3}>
              <FooterSectionHeader>NEWSLETTER</FooterSectionHeader>
              <SubscribeToNewsletterForm />
            </Grid>
          )}
        </Grid>
      </Container>
    </FooterContainer>
  );
}

export default Footer;
