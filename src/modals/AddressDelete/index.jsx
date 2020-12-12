import React from 'react';
import Confirmation from '../shared/Confirmation';

// Cookies
import { useCookies } from 'react-cookie';

function AddressDeleteModal({
  stores: { user: userStore, modal: modalStore, loading, snackbar },
  toggle,
}) {
  const [cookies, setCookie] = useCookies(['addressId']);
  const addressIdCookie = cookies['addressId'];
  const handleCancel = () => {
    toggle && toggle();
  };

  const handleDelete = async (addressId) => {
    try {
      loading.show();
      await userStore.deleteAddress(addressId);

      if (addressId === addressIdCookie) {
        // Remove the user's selected address cookie if they decide to remove
        // the address it corresponds to.
        setCookie('addressId', '');
      }

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
