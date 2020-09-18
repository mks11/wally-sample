import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'utils';
import ManagementPortal, { SidebarItem } from 'pages/management-portal';
import Typography from '@material-ui/core/Typography';

function RetailManagementPortal({ store: { retail: retailStore } }) {
  return (
    <ManagementPortal
      sidebar={<Sidebar store={retailStore} />}
      content={retailStore.activeContent}
    />
  );
}

export default connect('store')(RetailManagementPortal);

RetailManagementPortal.propTypes = {
  store: PropTypes.object.isRequired,
};

function Sidebar({ store }) {
  const [selected, setSelected] = useState('');

  return (
    <>
      <SidebarItem
        selected={selected}
        setSelected={setSelected}
        store={store}
        title="Categories"
        content={<Typography variant="body1">Categories</Typography>}
      />
      <SidebarItem
        selected={selected}
        setSelected={setSelected}
        store={store}
        title="Packaging"
        content={<Typography variant="body1">Packaging</Typography>}
      />
    </>
  );
}

Sidebar.propTypes = {
  store: PropTypes.object.isRequired,
};
