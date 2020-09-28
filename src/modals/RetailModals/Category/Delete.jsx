import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Confirmation from 'modals/shared/Confirmation';
import useDelete from 'hooks/useDelete';
import { API_CATEGORIES_DELETE } from 'config';

function Delete({ stores: { modal, ...store }, ...props }) {
  const id = modal.modalData;
  const [deleteCat, { success }] = useDelete(
    `${API_CATEGORIES_DELETE}/${id}`,
    store,
  );

  useEffect(() => {
    if (success) {
      props.toggle();
    }
  }, [success]);

  const handleConfirm = () => {
    deleteCat();
  };
  const handleCancel = () => {
    props.toggle(); // close the modal
  };

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
