import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableContainer, Paper, Box } from '@material-ui/core';

function _Table({ children }) {
  return (
    <TableContainer component={Paper} style={{ height: '100%' }}>
      <Table size="small" stickyHeader>
        {children}
      </Table>
    </TableContainer>
  );
}

export default _Table;
