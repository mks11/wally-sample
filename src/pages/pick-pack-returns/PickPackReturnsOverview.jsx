import React, { Component } from 'react';
import {AppBar, Tabs, Tab} from '@material-ui/core/';
import PickPackTab from './PickPackTab';
import moment from 'moment';
import PropTypes from 'prop-types';

// CSS
import styles from './Overview.module.css';

class PickPackReturnsOverview extends Component{
  constructor(props) {
    super(props)

    this.state = {
      selectedTab: 0,
    }
  }

  handleChange(event, value) {
    event.preventDefault();
    this.setState({selectedTab: value});
  }

  render() {
    return (
      <div className={styles.overview}>
        <h1 style={{textAlign: 'center', color: '#000'}}>
          {/* ex: July 6th, 2020 */}
          {moment().local().format("MMMM Do, YYYY")}
        </h1>
        <NavigationTabs selectedTab={this.state.selectedTab} handleChange={this.handleChange.bind(this)}/>
      </div>
    )
  }
}

class TabPanel extends Component {
  constructor(props) {
    super(props)
  }


  render() {
    const { children, value, index } = this.props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index }
        id={`full-width-tabpanel-${index}`}
        className={styles.tabPanel}
        aria-labelledby={`simple-tab-${index}`}
      >
        {
          value === index && children
        }
      </div>
    )
  }
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

class NavigationTabs extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {selectedTab, handleChange} = this.props;

    return (
      <>
        <AppBar position="static" color="default" elevation={1}>
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="Pick/Pack and Returns Portal navigation"
          >
            <Tab label="Pick/Pack" {...a11yProps(0) }/>
            <Tab label="Returns" {...a11yProps(1) }/>
            <Tab label="Cleaning" {...a11yProps(2) }/>
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
      </>
    )
  }
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default PickPackReturnsOverview;
