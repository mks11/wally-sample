import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

// Utils
import { logPageView, logEvent } from 'services/google-analytics';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// npm Package Components
import { Form, Formik } from 'formik';
import { Box, Grid, Typography } from '@material-ui/core';

// CustomComponents
import { TextInput } from 'common/FormikComponents/NonRenderPropAPI';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

// API
import { applyPromo } from 'api/promocode';

function ApplyPromoCodeForm({ onApply }) {
  const {
    checkout: checkoutStore,
    loading: loadingSpinnerStore,
    user: userStore,
    snackbar: snackbarStore,
  } = useStores();
  return (
    <>
      <Typography variant="h4" component="label">
        Have a promo code?
      </Typography>
      <Formik
        initialValues={{ promoCode: '' }}
        validationSchema={Yup.object({
          promoCode: Yup.string().required("Promo code can't be blank."),
        })}
        enableReinitialize={true}
        onSubmit={applyPromoCode}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box my={2}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextInput
                    color="primary"
                    disabled={isSubmitting}
                    name="promoCode"
                    placeholder="Enter your promo code."
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={4}>
                  <PrimaryWallyButton
                    disabled={isSubmitting}
                    style={{ padding: '1em 1.5em' }}
                    type="submit"
                  >
                    <Typography variant="h5" component="span">
                      Apply
                    </Typography>
                  </PrimaryWallyButton>
                </Grid>
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );

  async function applyPromoCode(
    { promoCode },
    { resetForm, setFieldError, setSubmitting },
  ) {
    const { user } = userStore;

    if (user) {
      try {
        logEvent({
          category: 'Checkout',
          action: 'AddPromo',
          label: promoCode,
        });
        const auth = userStore.getHeaderAuth();
        // loadingSpinnerStore.show();

        const res = await applyPromo(promoCode, auth);
        onApply && onApply(promoCode);
        // Reload the user if their promo included a benefit or store credit
        const {
          data: { benefit, store_credit },
        } = res;
        if (benefit || store_credit) await userStore.getUser();

        // Reload the order summary
        const addressId = userStore.selectedDeliveryAddress
          ? userStore.selectedDeliveryAddress.address_id
          : '';
        await checkoutStore.getOrderSummary(auth, null, null, addressId);
        snackbarStore.openSnackbar(
          'Promo code applied successfully!',
          'success',
        );
        resetForm();
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.param &&
          error.response.data.error.message
        ) {
          const { param, message } = error.response.data.error;
          setFieldError(param, message);
        }
      } finally {
        setSubmitting(false);
        // loadingSpinnerStore.hide();
      }
    }
  }
}

ApplyPromoCodeForm.propTypes = {
  onApply: PropTypes.func,
};

export default observer(ApplyPromoCodeForm);
