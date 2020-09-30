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
import useRequest from 'hooks/useRequest';
import usePost from 'hooks/usePost';
import getIdNamePair from './../getIdNamePair';
import { API_CATEGORIES_UPDATE } from 'config';
import usePatch from 'hooks/usePatch';
import { propTypes } from 'react-currency-input';

function Update({ stores: store, ...props }) {
  const { _id, categoryId } = store.modal.modalData;

  const all_possible_subcategories = useRequest(store, async () =>
    store.retail.getSubcategories(),
  );

  const [updateCategory, { data, loading: updating }] = usePatch(
    API_CATEGORIES_UPDATE,
    store,
  );

  const { name, child_ids = [], subcategories = [] } =
    store.retail.findCategoryById(categoryId) || {};

  const this_subcategories_ids = subcategories.map((v) => v.category_id);

  useEffect(() => {
    if (data && data.category_id) {
      store.retail.updateCategories(data);
      props.toggle(); // close the modal
    }
  }, [data]);

  const handleSubmit = async (values, { setSubmitting }) => {
    updateCategory(values);
    if (!updating) {
      setSubmitting(false);
    }
  };

  return (
    <FormWrapper title="Update Category">
      <Formik
        initialValues={{
          _id,
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
