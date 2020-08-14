import React, { Component } from 'react';
import { connect } from '../../utils';
import { AppBar, Tabs, Tab, Container } from '@material-ui/core';
import moment from 'moment';
import PropTypes from 'prop-types';

import PickPackTab from './PickPackTab';

// CSS
import styles from './Overview.module.css';

class PickPackReturnsOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: 0,
      fetching: true,
    };
    this.user = props.store.user;
    this.routing = props.store.routing;
  }

  handleChange = (e, value) => {
    e.preventDefault();
    this.setState({ selectedTab: value });
  };

  componentDidMount() {
    this.user
      .getStatus()
      .then((status) => {
        if (status) {
          if (this.user.isUser()) {
            this.routing.push('/main');
          }
        }
        this.setState({ fetching: false });
      })
      .catch((e) => {
        console.error('Failed to get status', e);
        this.setState({ fetching: false });
      });
  }

  render() {
    return this.state.fetching ? null : (
      <div className={styles.overview}>
        <h1 style={{ textAlign: 'center', color: '#000' }}>
          {/* ex: July 6th, 2020 */}
          {moment().local().format('MMMM Do, YYYY')}
        </h1>
        <NavigationTabs
          selectedTab={this.state.selectedTab}
          handleChange={this.handleChange}
        />
      </div>
    );
  }
}

function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      className={styles.tabPanel}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function NavigationTabs({ selectedTab, handleChange }) {
  return (
    <Container maxWidth={'lg'} disableGutters>
      <AppBar position="static" color="default" elevation={1}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="Pick/Pack and Returns Portal navigation"
        >
          <Tab label="Pick/Pack" {...a11yProps(0)} />
          <Tab label="Returns" {...a11yProps(1)} />
          <Tab label="Cleaning" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={selectedTab} index={0}>
        <PickPackTab />
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        {/* TODO Replace with actual component */}
        Returns
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        {/* TODO Replace with actual component */}
        Cleaning
      </TabPanel>
    </Container>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default connect('store')(PickPackReturnsOverview);
