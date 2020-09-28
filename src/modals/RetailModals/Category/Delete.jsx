import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Confirmation from 'modals/shared/Confirmation';
import useDelete from 'hooks/useDelete';
import { API_CATEGORIES_DELETE } from 'config';

function Delete({ stores: { modal, ...store }, ...props }) {
  const id = modal.modalData;
  const [deleteCat, { data, success }] = useDelete(
    `${API_CATEGORIES_DELETE}/${id}`,
    store,
  );

  const handleConfirm = () => {
    deleteCat();
  };

  const handleCancel = () => {
    props.toggle(); // close the modal
  };

  useEffect(() => {
    if (data && data.category_id) {
      store.retail.removeCategory(data.category_id);
    }

    if (success) {
      props.toggle();
    }
  }, [data, success]);

  return (
    <Confirmation
      title="Delete Category"
      message="Are you sure you want to delete this category?"
      onCancel={handleCancel}
      onConfirm={handleConfirm}
    />
  );
}

Delete.propTypes = {};

export default Delete;
