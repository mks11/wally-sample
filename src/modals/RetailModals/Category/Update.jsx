import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Grid, Typography } from '@material-ui/core';
import {
  TextInput,
  MultiSelect,
} from 'common/FormikComponents/NonRenderPropAPI';
import FormWrapper from '../FormWrapper';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import useRequest from 'common/hooks/useRequest';
import usePost from 'common/hooks/usePost';
import getIdNamePair from './../getIdNamePair';
import { API_CATEGORIES_UPDATE } from 'config';
import usePatch from 'common/hooks/usePatch';

const findById = (col, id) => col.find((v) => v._id === id);

function Update({ stores: store, ...props }) {
  const id = store.modal.modalData;

  if (!id) {
    return (
      <Typography color="error"> Sorry, we can't update this. </Typography>
    );
  }

  const all_possible_subcategories = useRequest(store, async () =>
    store.retail.getSubcategories(),
  );
  const all_categories = useRequest(store, async () =>
    store.retail.getCategories(),
  );

  const [updateCategory, { loading: posting, error: postError }] = usePatch(
    API_CATEGORIES_UPDATE,
    store,
  );

  const { name, child_ids = [] } = findById(all_categories, id) || {};

  const this_cat = findById(all_categories, id) || {};
  const this_subcategories_ids =
    this_cat.subcategories && this_cat.subcategories.map((v) => v.category_id);

  const handleSubmit = async (values, { setSubmitting }) => {
    // updateCategory(values);
    // if (!posting) {
    //   setSubmitting(false);
    // }
    // if (!posting && !postError) {
    //   props.toggle(); // close the modal
    // }
    alert(JSON.stringify(values));
  };

  return (
    <FormWrapper title="Update Category">
      <Formik
        initialValues={{
          _id: id,
          name,
          child_ids,
        }}
        enableReinitialize
        validationSchema={Yup.object({
          name: Yup.string().required("Name can't be blank"),
        })}
        onSubmit={handleSubmit}
      >
        <Form>
          <Grid item xs={12}>
            <TextInput name="name" label={'Name'} type={'text'} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <MultiSelect
              name="child_ids"
              label="Subcategories"
              values={all_possible_subcategories.map((v) => v.category_id)}
              preSelected={this_subcategories_ids}
              valueToDisplayMap={getIdNamePair(
                all_possible_subcategories,
                'category_id',
                'name',
              )}
            />
          </Grid>
          <Grid item xs={12} container justify="center">
            <PrimaryWallyButton type="submit">
              <Typography>Update</Typography>
            </PrimaryWallyButton>
          </Grid>
        </Form>
      </Formik>
    </FormWrapper>
  );
}

Update.propTypes = {};

export default Update;
