import React, { useEffect, useState } from 'react';
import { findIndex } from 'lodash';
import { Observer } from 'mobx-react';
import { connect } from 'utils';
import {
  Button,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  MenuItem,
  Box,
  Typography,
} from '@material-ui/core';
import Header from '../../shared/Header';
import Table from '../../shared/Table';
import StyledTableRow from 'common/table/StyledTableRow';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

import axios from 'axios';
import { API_GET_CATEGORIES } from 'config';
import { ArrowDropDown, Edit, Delete } from '@material-ui/icons';
import CRUDButtonGroup from '../../shared/CRUDButtonGroup';
import Dropdown from '../../shared/Dropdown';
import useRequest from 'common/hooks/useRequest';

function Categories({ store: { modal, retail, ...store } }) {
  const categories =
    useRequest(store, async () => retail.getCategories()) || [];

  const handleEdit = (cat) => {
    modal.toggleModal('retailCategoryUpdate', null, cat._id);
  };
  const handleRemove = (cat) => {
    modal.toggleModal('retailCategoryDelete', null, cat._id);
  };

  const handleAddCategory = () => {
    modal.toggleModal('retailCategoryAdd');
  };

  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        Categories
      </Typography>
      <Header
        onAdd={handleAddCategory}
        buttonText="Add Category"
        placeholder="search categories"
      />
      <Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell> Name </TableCell>
              <TableCell align="left"> Id </TableCell>
              <TableCell align="left"> Subcategories </TableCell>
              <TableCell align="center"> Actions </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <StyledTableRow key={cat.name}>
                <TableCell component="th" scope="row">
                  {cat.name}
                </TableCell>
                <TableCell align="left">{cat.category_id}</TableCell>
                <TableCell align="left">
                  <Dropdown
                    title="Subcategories"
                    collection={
                      cat.subcategories && cat.subcategories.map((v) => v.name)
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

class _Categories extends React.Component {
  render() {
    return <Categories store={this.props.store} />;
  }
}

export default connect('store')(_Categories);
