import React from 'react';
import styled from 'styled-components';
import ReportIssueForm from './ReportIssueForm';
import { Typography, Grid } from '@material-ui/core';

const ModalWrapper = styled(Grid)`
  padding: 0 2rem;
`;

function ReportIssueModal({ stores, toggle, ...props }) {
  const { modal } = stores;
  const { orderId, packagingReturnId } = modal.modalData;

  return (
    <ModalWrapper container justify="center">
      <Grid item xs={12}>
        <Typography variant="h1" gutterBottom>
          Report a problem
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {orderId && (
          <Typography variant="h2" gutterBottom>
            Order #: {orderId}
          </Typography>
        )}
        {packagingReturnId && (
          <Typography variant="h2" gutterBottom>
            Ref #: {packagingReturnId}
          </Typography>
        )}
      </Grid>
      <ReportIssueForm
        store={stores}
        toggle={toggle}
        orderId={orderId}
        packagingReturnId={packagingReturnId}
      />
    </ModalWrapper>
  );
}

export default ReportIssueModal;
