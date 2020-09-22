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

import Header from './../Header';
import Table from './../Table';
import Dropdown from './../Dropdown';
import StyledTableRow from './../StyledTableRow';
import CRUDButtonGroup from '../CRUDButtonGroup';

function Subcategories({
  store: { user: userStore, modal, loading, snackbar, retail: retailStore },
}) {
  const [categoriesPopulated, setCategoriesPopulated] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        loading.show();
        const subcategories = await retailStore.getSubcategories();
        const categories = await retailStore.getCategories();
        const filled = populateCategories(subcategories, categories);
        setCategoriesPopulated(filled);
      } catch (e) {
      } finally {
        loading.hide();
      }
    })();
  }, []);

  const handleEdit = () => {
    modal.toggleModal('retailSubcategoryUpdate');
  };
  const handleRemove = () => {
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
        title="Add Subcategory"
        placeholder="search subcategories"
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell> Name </TableCell>
            <TableCell align="right"> Id </TableCell>
            <TableCell align="right"> Categories </TableCell>
            <TableCell align="center"> Actions </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categoriesPopulated.map((cat) => (
            <StyledTableRow key={cat.name}>
              <TableCell component="th" scope="row">
                {cat.name}
              </TableCell>
              <TableCell align="right">{cat.category_id}</TableCell>
              <TableCell align="right">
                <Dropdown title="Categories" collection={cat.parent_names} />
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
  );
}

function getNameFromCatId(cat_id, collection) {
  const i = findIndex(collection, (s) => s.category_id === cat_id);
  if (i > -1) {
    return collection[i].name;
  }
}
function populateCategories(subcat, cat) {
  const filled = subcat.map(({ parent_ids, ...c }) => {
    const parent_names = parent_ids.map((c_id) => getNameFromCatId(c_id, cat));
    return { ...c, parent_names };
  });

  return filled;
}

class _Subcategories extends React.Component {
  render() {
    return <Subcategories store={this.props.store} />;
  }
}

export default connect('store')(_Subcategories);
