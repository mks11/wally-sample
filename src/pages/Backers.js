import React, { useEffect } from 'react';

import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';
import { Box, List, ListItem, Typography } from '@material-ui/core';
import Page from './shared/Page';

function Backers() {
  const {
    user: userStore,
    modal: modalStore,
    backer: backerStore,
  } = useStores();

  useEffect(() => {
    userStore.getStatus();
    backerStore
      .loadBackers()
      .then((data) => {
        // data loaded
      })
      .catch((e) => {
        modalStore.toggleModal('error');
      });
  }, [userStore, backerStore, modalStore]);

  return (
    <Page description="The Wally Shop's Kick-Starter backers.">
      <Box textAlign="center" px={2} mt={4}>
        <Typography variant="h1" gutterBottom>
          Our Backers
        </Typography>
        <Typography variant="h3" gutterBottom>
          We are extremely grateful to the following people who made this all
          possible:
        </Typography>
        <hr />
      </Box>
      <Box justifyContent="center">
        <List>
          {backerStore.backers.map((b, key) => (
            <ListItem
              key={key}
              style={{ justifyContent: 'center' }}
              alignItems="center"
            >
              <Typography align="center" variant="body1">
                {b}
              </Typography>
            </ListItem>
          ))}
          <br />
        </List>
      </Box>
    </Page>
  );
}

export default observer(Backers);
