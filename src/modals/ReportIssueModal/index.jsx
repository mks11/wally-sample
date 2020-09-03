import React, { Component } from 'react';
import ReportIssueForm from './ReportIssueForm';
import { Typography, Box, Grid } from '@material-ui/core';

class ReportIssueModal extends Component {
  constructor(props) {
    super(props);
    this.modalStore = this.props.stores.modal;
  }

  render() {
    const order_id = this.modalStore.modalData;
    return (
      <>
        <Grid container xs={12} justify="center">
          <div className="order-wrap pb-5">
            <Box marginY={3}>
              <Typography variant="h3" className="m-0 mb-2">
                Order Issue
              </Typography>
              <Typography component="span" className="text-order mb-3">
                Order: #{order_id}
              </Typography>
            </Box>
            <Typography className="text-order text-bold mt-2">
              Describe your issue below:
            </Typography>
            <ReportIssueForm
              store={this.props.stores}
              toggle={this.props.toggle}
              orderId={order_id}
            />
          </div>
        </Grid>
      </>
    );
  }
}

export default ReportIssueModal;
