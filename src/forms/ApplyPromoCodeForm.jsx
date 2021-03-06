import React from 'react';
import * as Yup from 'yup';
import moment from 'moment';

// Utils
import { logEvent } from 'services/google-analytics';

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

function ApplyPromoCodeForm() {
  const {
    checkout: checkoutStore,
    user: userStore,
    routing,
    snackbar: snackbarStore,
  } = useStores();
  return (
    <>
      <Typography variant="h5" component="label">
        Redeem a promo code or gift card
      </Typography>
      <Formik
        initialValues={{ promoCode: '', timestamp: moment().toISOString(true) }}
        validationSchema={Yup.object({
          promoCode: Yup.string().required("Promo code can't be blank."),
        })}
        enableReinitialize={true}
        onSubmit={applyPromoCode}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={2}>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <TextInput
                    color="primary"
                    disabled={isSubmitting}
                    name="promoCode"
                    placeholder="Promo code"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={4}>
                  <PrimaryWallyButton
                    disabled={isSubmitting}
                    style={{ height: '56px', maxHeight: '56px' }}
                    fullWidth
                    type="submit"
                    disableElevation
                  >
                    Apply
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
    { promoCode, timestamp },
    { resetForm, setFieldError, setSubmitting },
  ) {
    const { user } = userStore;

    if (user) {
      try {
        const auth = userStore.getHeaderAuth();
        const res = await applyPromo({ promoCode, timestamp }, auth);
        // Reload the user if their promo included a benefit or store credit
        const {
          data: {
            benefit,
            delivery_fee_discount,
            discount_percentage,
            store_credit,
          },
        } = res;
        const promoAppliedDuringCheckout = routing.location.pathname.includes(
          'checkout',
        );

        logEvent({
          category: 'Promotions & Gift Cards',
          action: promoAppliedDuringCheckout
            ? 'Apply Promo at Checkout'
            : 'Apply Promo at Account',
          label: promoCode,
        });
        if (benefit || store_credit) await userStore.getUser();
        if (delivery_fee_discount || discount_percentage) {
          await checkoutStore.getCurrentCart(auth);
        }
        await checkoutStore.getOrderSummary(auth);
        snackbarStore.openSnackbar(
          'Promo code applied successfully!',
          'success',
        );
        resetForm();
      } catch (error) {
        logEvent({
          category: 'Promotions & Gift Cards',
          action: 'Apply Promo Failure',
          label: promoCode,
          nonInteraction: true,
        });
        if (
          error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.param &&
          error.response.data.error.message
        ) {
          const { param, message } = error.response.data.error;
          setFieldError(param, message);
        } else {
          snackbarStore.openSnackbar(
            "Your promo code couldn't be applied.",
            'error',
          );
        }
      } finally {
        setSubmitting(false);
      }
    }
  }
}

export default observer(ApplyPromoCodeForm);
