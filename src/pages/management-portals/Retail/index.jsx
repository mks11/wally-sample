import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'utils';
import ManagementPortal, {
  SidebarItem,
} from 'pages/management-portals/ManagementPortal';

// Panels
import Categories from './Categories';
import Copacking from './Copacking';
import Subcategories from './Subcategories';

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
        content={<Categories />}
      />
      <SidebarItem
        selected={selected}
        setSelected={setSelected}
        store={store}
        title="Subcategories"
        content={<Subcategories />}
      />
      <SidebarItem
        selected={selected}
        setSelected={setSelected}
        store={store}
        title="Copacking Rounds"
        content={<Copacking />}
      />
    </>
  );
}

Sidebar.propTypes = {
  store: PropTypes.object.isRequired,
};
