import React from 'react';

// Cookies
import { useCookies } from 'react-cookie';

// Forms
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

// Material UI
import {
  Box,
  FormControlLabel,
  Grid,
  makeStyles,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';

// Sorting and Filtration
import {
  cookieName,
  initializeProductAssortmentPrefs,
} from 'templates/ShoppingPage';
import sortingConfig from './sorting-config';

// Styled Components
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import { useLocation } from 'react-router-dom';

export default function SortAndFilterMenu() {
  const [cookies, setCookie] = useCookies([cookieName]);
  var productAssortmentPrefs = cookies[cookieName];
  if (!productAssortmentPrefs) productAssortmentPrefs = {};
  const location = useLocation();

  const {
    pathname = '',
    selectedSortingOption = '',
    selectedBrands = [],
    selectedLifestyles = [],
    selectedSubcategories = [],
    selectedValues = [],
  } = productAssortmentPrefs;

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setCookie(cookieName, { pathname, ...values }, { path: '/' });
    setSubmitting(false);
  };

  const handleReset = (resetForm) => {
    resetForm({ ...productAssortmentPrefs });
    initializeProductAssortmentPrefs(
      cookieName,
      location && location.pathname,
      setCookie,
    );
  };

  return (
    <Formik
      initialValues={{
        selectedSortingOption,
        selectedBrands,
        selectedLifestyles,
        selectedSubcategories,
        selectedValues,
      }}
      validationSchema={Yup.object({
        selectedSortingOption: Yup.string().required(),
      })}
      enableReinitialize={true}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, resetForm }) => (
        <Form>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={6}>
              <PrimaryWallyButton
                variant="outlined"
                disabled={isSubmitting}
                fullWidth
                onClick={() => handleReset(resetForm)}
              >
                Reset
              </PrimaryWallyButton>
            </Grid>
            <Grid item xs={6}>
              <PrimaryWallyButton
                type="submit"
                disabled={isSubmitting}
                fullWidth
              >
                Done
              </PrimaryWallyButton>
            </Grid>
          </Grid>
          <Field name="selectedSortingOption" component={SortingOptionGroup} />
        </Form>
      )}
    </Formik>
  );
}

function SortingOptionGroup({ field }) {
  return (
    <RadioGroup aria-label={'sorting options'} {...field}>
      {sortingConfig.map((option) => (
        <SortingOption
          key={option.label}
          label={option.label}
          value={option.value}
        />
      ))}
    </RadioGroup>
  );
}

function SortingOption({ label, value }) {
  const classes = makeStyles(() => ({
    root: {
      width: '100%', // to make label clickable for the entire width
      display: 'flex',
      alignItems: 'center',
    },
    label: {
      width: '100%',
    },
  }));

  return (
    <FormControlLabel
      classes={{ root: classes.root, label: classes.label }}
      control={<Radio color="primary" />}
      value={value}
      label={label}
    />
  );
}
