import React, { useEffect, useState } from 'react';
import { findIndex } from 'lodash';
import { observer } from 'mobx-react';
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
import useRequest from 'hooks/useRequest';
import { useStores } from 'hooks/mobx';

function Categories() {
  const store = useStores();
  const { modal, retail } = store;
  const [categories, setCategories] = useState([]);
  useRequest(store, () => retail.getCategories());

  const handleEdit = (cat) => {
    modal.toggleModal('retailCategoryUpdate', null, {
      _id: cat._id,
      categoryId: cat.category_id,
    });
  };
  const handleRemove = (cat) => {
    modal.toggleModal('retailCategoryDelete', null, cat._id);
  };
  const handleAddCategory = () => {
    modal.toggleModal('retailCategoryAdd');
  };

  useEffect(() => {
    setCategories(retail.categories);
  }, [retail.categories]);

  const handleSearch = (txt) => {
    setCategories(
      retail.categories.filter((c) => {
        const regEx = new RegExp(txt, 'ig');
        const name_matches = c.name && c.name.search(regEx);
        const id_matches = c.category_id && c.category_id.search(regEx);
        return name_matches > -1 || id_matches > -1;
      }),
    );
  };

  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        Categories
      </Typography>
      <Header
        onAdd={handleAddCategory}
        buttonText="Add Category"
        placeholder="search categories by name or id"
        onSearch={handleSearch}
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

export default observer(Categories);
