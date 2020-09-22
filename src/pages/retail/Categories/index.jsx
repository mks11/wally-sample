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
import Header from './../Header';
import Table from './../Table';
import StyledTableRow from './../StyledTableRow';
import { PrimaryWallyButton } from './../../../styled-component-lib/Buttons';

import axios from 'axios';
import { API_GET_CATEGORIES } from 'config';
import { ArrowDropDown, Edit, Delete } from '@material-ui/icons';
import CRUDButtonGroup from '../CRUDButtonGroup';
import Dropdown from './../Dropdown';

function Categories({
  store: { user: userStore, modal, loading, snackbar, retail: retailStore },
}) {
  const [categoriesPopulated, setCategoriesPopulated] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        loading.show();
        const categories = await retailStore.getCategories();
        const subcategories = await retailStore.getSubcategories();
        const filled = populateChildren(categories, subcategories);
        setCategoriesPopulated(filled);
      } catch (e) {
        //Todo
      } finally {
        loading.hide();
      }
    })();
  }, []);

  const handleEdit = () => {
    modal.toggleModal('retailCategoryUpdate');
  };
  const handleRemove = () => {
    modal.toggleModal('retailCategoryDelete');
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
        title="Add Category"
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
            {categoriesPopulated.map((cat) => (
              <StyledTableRow key={cat.name}>
                <TableCell component="th" scope="row">
                  {cat.name}
                </TableCell>
                <TableCell align="left">{cat.category_id}</TableCell>
                <TableCell align="left">
                  <Dropdown
                    title="Subcategories"
                    collection={cat.child_names}
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

function getNameFromCatId(cat_id, collection) {
  const i = findIndex(collection, (s) => s.category_id === cat_id);
  if (i > -1) {
    return collection[i].name;
  }
}
function populateChildren(categories, subcat) {
  const filled = categories.map(({ child_ids, ...c }) => {
    const child_names = child_ids.map((c_id) => getNameFromCatId(c_id, subcat));
    return { ...c, child_names };
  });

  return filled;
}

class _Categories extends React.Component {
  render() {
    return <Categories store={this.props.store} />;
  }
}

export default connect('store')(_Categories);
