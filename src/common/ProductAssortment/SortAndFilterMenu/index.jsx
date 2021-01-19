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

// Sorting Options
import sortingConfig from './sorting-config';

// Styled Components
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

export default function SortAndFilterMenu() {
  const cookieName = 'productAssortmentPrefs';
  const [cookies, setCookie] = useCookies([cookieName]);
  const productAssortmentPrefs = cookies[cookieName];
  const {
    pathname,
    selectedSortingOption,
    selectedBrands,
    selectedLifestyles,
    selectedSubcategories,
    selectedValues,
  } = productAssortmentPrefs;

  const handleSubmit = (values, { setSubmitting }) => {
    setCookie(cookieName, { pathname, ...values }, { path: '/' });
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        selectedSortingOption: selectedSortingOption
          ? selectedSortingOption
          : '',
        selectedBrands:
          selectedBrands && selectedBrands.length ? selectedBrands : [],
        selectedLifestyles:
          selectedLifestyles && selectedLifestyles.length
            ? selectedLifestyles
            : [],
        selectedSubcategories:
          selectedSubcategories && selectedSubcategories.length
            ? selectedSubcategories
            : [],
        selectedValues:
          selectedValues && selectedValues.length ? selectedValues : [],
      }}
      validationSchema={Yup.object({
        selectedSortingOption: Yup.string().required(),
      })}
      enableReinitialize={true}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={6}>
              <PrimaryWallyButton
                type="reset"
                variant="outlined"
                disabled={isSubmitting}
                fullWidth
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
