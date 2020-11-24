import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { validateEmail } from '../utils';
import { Facebook, Instagram } from '@material-ui/icons';
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';
import {
  List,
  ListItem,
  Grid,
  Typography,
  Box,
  Container,
} from '@material-ui/core';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

import SubscribeToNewsletter from './../common/SubscribeToNewsletter';

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

  h4 {
    letter-spacing: 1.5px;
    margin-bottom: 0;
    padding-bottom: 12px;
    position: relative;
    display: inline-block;
    font-size: 16px;
  }

  @media (min-width: 768px) {
    padding: 60px 0;
  }

  @media (min-width: 768px) {
    h4 {
      font-size: 16px;
    }
  }

  h4:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3px;
    background-color: #263a52;
  }
`;

const MobileFooterWrapper = styled(Grid)`
  @media only screen and (min-width: 567px) {
    display: none;
  }
`;

const FooterWrapper = styled(Grid)`
  @media only screen and (max-width: 566px) {
    display: none;
  }
`;

function Footer() {
  return (
    <FooterContainer>
      <Container maxWidth="xl">
        <MobileFooterWrapper container justify="space-between" spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h4">THE WALLY SHOP</Typography>
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
          <Grid item xs={12}>
            <Typography variant="h4">SUPPORT</Typography>
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
          <Grid item xs={12}>
            <Typography variant="h4">FOLLOW US</Typography>
            <List>
              <ListItem disableGutters>
                <a href={FACEBOOK} target="_blank" rel="noopener noreferrer">
                  <Facebook style={{ fontSize: '48px' }} />
                </a>
              </ListItem>
              <ListItem disableGutters>
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
                  <Instagram style={{ fontSize: '48px' }} />
                </a>
              </ListItem>
            </List>
          </Grid>
        </MobileFooterWrapper>
        {/* Rendered md and up */}
        <FooterWrapper container justify="space-between" spacing={4}>
          <Grid item>
            <Typography variant="h4">THE WALLY SHOP</Typography>
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
          <Grid item>
            <Typography variant="h4">SUPPORT</Typography>
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
          <Grid item>
            <Typography variant="h4">FOLLOW US</Typography>
            <List>
              <ListItem disableGutters>
                <a href={FACEBOOK} target="_blank" rel="noopener noreferrer">
                  <Facebook style={{ fontSize: '48px' }} />
                </a>
              </ListItem>
              <ListItem disableGutters>
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
                  <Instagram style={{ fontSize: '48px' }} />
                </a>
              </ListItem>
            </List>
          </Grid>
        </FooterWrapper>

        <Box>
          <SubscribeToNewsletter />
        </Box>
      </Container>
    </FooterContainer>
  );
}

export default observer(Footer);
