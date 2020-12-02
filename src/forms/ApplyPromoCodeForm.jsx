import React from 'react';
import * as Yup from 'yup';

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
    snackbar: snackbarStore,
  } = useStores();
  return (
    <>
      <Typography variant="h5" component="label">
        Redeem a promo code or gift card
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
                    placeholder="Promo code"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={4}>
                  <PrimaryWallyButton
                    disabled={isSubmitting}
                    style={{ maxHeight: '56px' }}
                    fullWidth
                    type="submit"
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
    { promoCode },
    { resetForm, setFieldError, setSubmitting },
  ) {
    const { user } = userStore;

    if (user) {
      try {
        logEvent({
          category: 'Promotions & Gift Cards',
          action: 'ApplyPromo',
          label: promoCode,
        });
        const auth = userStore.getHeaderAuth();

        const res = await applyPromo(promoCode, auth);
        // Reload the user if their promo included a benefit or store credit
        const {
          data: { benefit, store_credit },
        } = res;
        if (benefit || store_credit) await userStore.getUser();

        await checkoutStore.getOrderSummary(auth);
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
