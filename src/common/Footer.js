import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { validateEmail } from '../utils';
import { INSTAGRAM, FACEBOOK } from '../config';
import { Facebook, Instagram } from '@material-ui/icons';
import footerLogo from 'images/logo.png';
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

import styled from 'styled-components';

const FooterContainer = styled.footer`
  padding: 30px 0;
  color: #263a52;
  line-height: 2;
  position: relative;
  a {
    color: #263a52;
  }
  ul {
    list-style-type: none;
    padding: 0;
    margin-top: 15px;
  }
  ul.aw-social {
    line-height: 1;
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

function Footer() {
  const [state, setState] = useState({
    email: '',
    invalidText: '',
  });

  const { user: userStore, routing: routingStore } = useStores();

  const handleSubscribe = () => {
    if (!validateEmail(state.email)) {
      setState((p) => ({ ...p, invalidText: 'Invalid email' }));
      return;
    }

    setState((p) => ({ ...p, invalidText: false }));

    userStore
      .subscribeNewsletter(state.email)
      .then(() => {
        setState((p) => ({
          ...p,
          invalidText: '',
          successText: 'Subscribed!',
        }));
        setTimeout(() => {
          setState((p) => ({ ...p, successText: '' }));
        }, 1500);
      })
      .catch((e) => {
        setState((p) => ({ ...p, invalidText: 'Failed to subscribe' }));
      });
  };

  const handleEmailChange = (e) => {
    setState((p) => ({ ...p, email: e.target.value, invalidText: '' }));
  };
  const isHomePage = routingStore.location.pathname === '/';

  let isAdmin = false;
  if (userStore.user) {
    const user = userStore.user;
    isAdmin = user.type === 'admin';
  }
  if (isAdmin) return null;
  return (
    <FooterContainer>
      <Container>
        <Box display="flex">
          <Box flexShrink={1} px={1}>
            <a href="/">
              <img className="footer-logo" src={footerLogo} alt="" />
            </a>
          </Box>
          <Box flexGrow={1}>
            <Grid container spacing={2}>
              <Grid item sm={4}>
                <Typography variant="h4">THE WALLY SHOP</Typography>
                <List dense>
                  <ListItem>
                    <Link to="about">About</Link>
                  </ListItem>
                  <ListItem>
                    <Link to="howitworks">How It Works</Link>
                  </ListItem>
                  <ListItem>
                    <Link to="/backers">Our Backers</Link>
                  </ListItem>
                  <ListItem>
                    <Link to="/blog">Blog</Link>
                  </ListItem>
                </List>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="h4">SUPPORT</Typography>
                <List dense>
                  <ListItem>
                    <a href="mailto:info@thewallyshop.co">Contact Us</a>
                  </ListItem>
                  <ListItem>
                    <Link to={'/tnc'}>Terms &amp; Conditions</Link>
                  </ListItem>
                  <ListItem>
                    <Link to={'/privacy'}>Privacy Policy</Link>
                  </ListItem>
                </List>
              </Grid>
              <Grid item sm={4}>
                <Typography variant="h4">FOLLOW US</Typography>
                <List dense>
                  <ListItem>
                    <a
                      href={FACEBOOK}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook style={{ fontSize: '48px' }} />
                    </a>
                  </ListItem>
                  <ListItem>
                    <a
                      href={INSTAGRAM}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram style={{ fontSize: '48px' }} />
                    </a>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Container>
        <div className="footer-bottom">
          <Box>
            <form className="form-inline" style={{ position: 'relative' }}>
              <label htmlFor="subscribe-email">
                Subscribe to our newsletter
              </label>
              <div className="input-group">
                <input
                  type="email"
                  id="subscribe-email"
                  className="form-control"
                  placeholder="Enter your email"
                  onChange={handleEmailChange}
                />
                <div className="input-group-append">
                  <PrimaryWallyButton
                    className="btn btn-primary"
                    type="button"
                    id="btn-subscribe"
                    onClick={(e) => handleSubscribe(e)}
                  >
                    Subscribe
                  </PrimaryWallyButton>
                </div>
              </div>
              {state.invalidText ? (
                <Typography variant="error" component="span">
                  {state.invalidText}
                </Typography>
              ) : null}
              {state.successText ? (
                <Typography variant="success" component="span">
                  {state.successText}
                </Typography>
              ) : null}
            </form>
          </Box>
        </div>
      </Container>
    </FooterContainer>
  );
}

export default observer(Footer);
