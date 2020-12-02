import React from 'react';
import Confirmation from '../shared/Confirmation';

function AddressDeleteModal({
  stores: { user: userStore, modal: modalStore, loading, snackbar },
  toggle,
}) {
  const handleCancel = () => {
    toggle && toggle();
  };

  const handleDelete = async (address_id) => {
    try {
      loading.show();
      await userStore.deleteAddress(address_id);
      snackbar.openSnackbar(
        'Your address was deleted successfully.',
        'success',
      );
      toggle && toggle(); // close the modal
    } catch (error) {
      snackbar.openSnackbar(
        'An error occured while deleting your address. Please contact us at info@thewallyshop.co for assistance.',
        'error',
      );
    } finally {
      setTimeout(loading.hide(), 300);
    }
  };

  const address_id = modalStore.modalData;

  return (
    <Confirmation
      title="Delete Address"
      message="Are you sure you want to remove this address?"
      onCancel={handleCancel}
      onConfirm={() => handleDelete(address_id)}
    />
  );
}

export default AddressDeleteModal;
