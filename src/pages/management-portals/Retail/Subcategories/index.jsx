import React, { useEffect, useState } from 'react';
import { findIndex } from 'lodash';
import { connect } from 'utils';
import {
  Button,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  Box,
  Typography,
} from '@material-ui/core';

import Header from '../../shared/Header';
import Table from '../../shared/Table';
import Dropdown from '../../shared/Dropdown';
import StyledTableRow from '../../../../common/table/StyledTableRow';
import CRUDButtonGroup from '../../shared/CRUDButtonGroup';
import useRequest from 'common/hooks/useRequest';

function Subcategories({ store: { modal, retail, ...store } }) {
  const subcategories =
    useRequest(store, async () => retail.getSubcategories()) || [];

  const handleEdit = (cat) => {
    modal.toggleModal('retailSubcategoryUpdate', null, cat._id);
  };
  const handleRemove = (cat) => {
    modal.toggleModal('retailSubcategoryDelete');
  };

  const handleAddCategory = () => {
    modal.toggleModal('retailSubcategoryAdd');
  };

  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        Subcategories
      </Typography>
      <Header
        onAdd={handleAddCategory}
        buttonText="Add Subcategory"
        placeholder="search subcategories"
      />
      <Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell> Name </TableCell>
              <TableCell align="left"> Id </TableCell>
              <TableCell align="left"> Categories </TableCell>
              <TableCell align="center"> Actions </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subcategories.map((cat) => (
              <StyledTableRow key={cat.name}>
                <TableCell component="th" scope="row">
                  {cat.name}
                </TableCell>
                <TableCell align="left">{cat.category_id}</TableCell>
                <TableCell align="left">
                  <Dropdown
                    title="Categories"
                    collection={
                      cat.parent_categories &&
                      cat.parent_categories.map((v) => v.name)
                    }
                  />
                </TableCell>
                <TableCell>
                  <CRUDButtonGroup
                    onUpdate={() => handleEdit(cat)}
                    onDelete={() => handleRemove(cat)}
                  />
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}

class _Subcategories extends React.Component {
  render() {
    return <Subcategories store={this.props.store} />;
  }
}

export default connect('store')(_Subcategories);
