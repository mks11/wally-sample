import React from 'react';
import * as Yup from 'yup';

// Utils
import { logPageView, logEvent } from 'services/google-analytics';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// npm Package Components
import { Form, Formik } from 'formik';
import { Box, Typography } from '@material-ui/core';

// CustomComponents
import { TextInput } from 'common/FormikComponents/NonRenderPropAPI';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

// API
import { applyPromo } from 'api/referral';

function ApplyPromoCodeForm({ onApply }) {
  const {
    checkout: checkoutStore,
    loading: loadingSpinnerStore,
    user: userStore,
    snackbar: snackbarStore,
  } = useStores();

  return (
    <Formik
      initialValues={{ promoCode: '' }}
      validationSchema={Yup.object({
        promoCode: Yup.string().required("Promo code can't be blank."),
      })}
      enableReinitialize={true}
      onSubmit={applyPromoCode}
    >
      <Form>
        <Box my={2}>
          <TextInput
            name="promoCode"
            variant="outlined"
            color="primary"
            placeholder="Enter a valid promo code."
          />
        </Box>
        <Box my={2}>
          <PrimaryWallyButton style={{ padding: '1em 1.5em' }} type="submit">
            <Typography variant="h5" component="span">
              Submit
            </Typography>
          </PrimaryWallyButton>
        </Box>
      </Form>
    </Formik>
  );

  async function applyPromoCode(
    { promoCode },
    { setFieldError, setSubmitting },
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

        // Reload the user if their promo included a benefit
        const {
          data: { benefit },
        } = res;
        if (benefit) await userStore.getUser();

        // Reload the order summary
        const addressId = userStore.selectedDeliveryAddress
          ? userStore.selectedDeliveryAddress.address_id
          : '';
        await checkoutStore.getOrderSummary(auth, null, null, addressId);

        snackbarStore.open('Promo code applied successfully!');
      } catch (error) {
        alert(error);
      } finally {
        setSubmitting(false);
        // loadingSpinnerStore.hide();
      }
    }
  }
}

export default observer(ApplyPromoCodeForm);
