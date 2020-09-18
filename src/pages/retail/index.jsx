import React from 'react';
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

function Sidebar({ store }) {
  return (
    <>
      <SidebarItem
        store={store}
        title="Categories"
        content={<Typography variant="body1">Categories</Typography>}
      />
      <SidebarItem
        store={store}
        title="Packaging"
        content={<Typography variant="body1">Packaging</Typography>}
      />
    </>
  );
}

export default connect('store')(RetailManagementPortal);
