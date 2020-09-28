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
import useRequest from 'hooks/useRequest';

function Subcategories({ store: { modal, retail, ...store } }) {
  const all_subcats =
    useRequest(store, async () => retail.getSubcategories()) || [];

  const [subcategories, setSubcategories] = useState([]);

  const handleEdit = (cat) => {
    modal.toggleModal('retailSubcategoryUpdate', null, cat._id);
  };
  const handleRemove = (cat) => {
    modal.toggleModal('retailSubcategoryDelete', null, cat._id);
  };

  const handleAddCategory = () => {
    modal.toggleModal('retailSubcategoryAdd');
  };

  useEffect(() => {
    setSubcategories(all_subcats);
  }, [all_subcats]);

  const handleSearch = (txt) => {
    setSubcategories(
      all_subcats.filter((c) => {
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
        Subcategories
      </Typography>
      <Header
        onAdd={handleAddCategory}
        buttonText="Add Subcategory"
        placeholder="search subcategories by name or id"
        onSearch={handleSearch}
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
