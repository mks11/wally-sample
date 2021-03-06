import React, { useState } from 'react';

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
  ListItemText,
  ListItem,
  Collapse,
  Divider,
  Checkbox,
  FormGroup,
} from '@material-ui/core';

// MobX
import { useStores } from 'hooks/mobx';

// Sorting and Filtration
import {
  cookieName,
  initializeProductAssortmentPrefs,
} from 'templates/ShoppingPage';
import sortingConfig from './sorting-config';

// Styled Components
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import { useLocation } from 'react-router-dom';
import { Add, Remove } from '@material-ui/icons';

export default function SortAndFilterMenu() {
  const [cookies, setCookie] = useCookies([cookieName]);
  var productAssortmentPrefs = cookies[cookieName];
  if (!productAssortmentPrefs) productAssortmentPrefs = {};
  const location = useLocation();
  const { modalV2, product: productStore } = useStores();
  const {
    pathname = '',
    selectedSortingOption = '',
    selectedBrands = [],
    selectedLifestyles = [],
    selectedSubcategories = [],
    selectedValues = [],
  } = productAssortmentPrefs;

  const {
    availableBrands,
    availableLifestyles,
    availableSubcategories,
    availableValues,
  } = productStore;

  const handleSubmit = (values, { setSubmitting }) => {
    setCookie(cookieName, { pathname, ...values }, { path: '/' });
    setSubmitting(false);
    modalV2.close();
  };

  const handleReset = (resetForm) => {
    resetForm();
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
        selectedBrands: Yup.array().of(Yup.string()),
        selectedLifestyles: Yup.array().of(Yup.string()),
        selectedSubcategories: Yup.array().of(Yup.string()),
        selectedValues: Yup.array().of(Yup.string()),
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
          <Box marginTop={2}>
            <CollapsableItem label="Sort">
              <Field
                name="selectedSortingOption"
                component={SortingOptionGroup}
              />
            </CollapsableItem>
            {availableSubcategories.length > 1 && (
              <CollapsableItem label="Shop by Category">
                <Field
                  name="selectedSubcategories"
                  component={CheckboxGroup}
                  options={availableSubcategories}
                />
              </CollapsableItem>
            )}
            {availableLifestyles.length > 1 && (
              <CollapsableItem label="Shop by Lifestyle">
                <Field
                  name="selectedLifestyles"
                  component={CheckboxGroup}
                  options={availableLifestyles}
                />
              </CollapsableItem>
            )}
            {availableValues.length > 1 && (
              <CollapsableItem label="Shop by Values">
                <Field
                  name="selectedValues"
                  component={CheckboxGroup}
                  options={availableValues}
                />
              </CollapsableItem>
            )}
            {availableBrands.length > 1 && (
              <CollapsableItem label="Shop by Brand">
                <Field
                  name="selectedBrands"
                  component={CheckboxGroup}
                  options={availableBrands}
                />
              </CollapsableItem>
            )}
          </Box>
        </Form>
      )}
    </Formik>
  );
}

function CollapsableItem({ label, children }) {
  const [show, setShow] = useState(true);

  const handleToggle = () => {
    setShow((show) => !show);
  };

  return (
    <>
      <ListItem button onClick={handleToggle}>
        <ListItemText primary={label} color="primary" />
        {show ? <Remove /> : <Add />}
      </ListItem>
      <Collapse in={show} timeout="auto" unmountOnExit>
        <Box paddingX={4}>{children}</Box>
      </Collapse>
      <Divider />
    </>
  );
}

function CheckboxGroup({ field, options = [] }) {
  return (
    <FormGroup aria-label={'Filtration options'}>
      {options.map((option) => (
        <CheckboxOption
          key={option}
          label={option}
          value={option}
          field={field}
        />
      ))}
    </FormGroup>
  );
}
function CheckboxOption({ field, label, value }) {
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

  const isChecked =
    value &&
    field.value &&
    Array.isArray(field.value) &&
    field.value.includes(value);

  return (
    <FormControlLabel
      classes={{ root: classes.root, label: classes.label }}
      control={
        <Checkbox
          color="primary"
          checked={isChecked}
          {...field}
          value={value}
        />
      }
      label={label}
    />
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
