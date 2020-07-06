import React, { Component } from 'react';
import {AppBar, Tabs, Tab, Typography} from '@material-ui/core/';
import moment from 'moment';
import PropTypes from 'prop-types';

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
      <div>
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
        aria-labelledby={`simple-tab-${index}`}
      >
        {
          value === index && (
            <Typography>{children}</Typography>
          )
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
        <AppBar position="static" color="default">
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
          </Tabs>
        </AppBar>
        <TabPanel value={selectedTab} index={0}>
          {/* TODO Replace with actual component */}
          Pick Pack
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          {/* TODO Replace with actual component */}
          Returns
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
