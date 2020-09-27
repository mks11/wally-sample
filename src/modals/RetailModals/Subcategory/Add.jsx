import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Grid, Typography } from '@material-ui/core';
import {
  TextInput,
  MultiSelect,
  Select,
} from 'common/FormikComponents/NonRenderPropAPI';
import FormWrapper from '../FormWrapper';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import { API_SUBCATEGORIES_POST, API_PACKAGING_LIST } from 'config';
import useRequest from 'common/hooks/useRequest';
import usePost from 'common/hooks/usePost';
import useGet from 'common/hooks/useGet';
import getIdNamePair from './../getIdNamePair';

function Add({ stores: store, ...props }) {
  const cats =
    useRequest(store, async () => store.retail.getCategories()) || [];
  const { data: packaging } = useGet(API_PACKAGING_LIST, store);

  const [addSubcategory, { success, loading: posting }] = usePost(
    API_SUBCATEGORIES_POST,
    store,
  );

  useEffect(() => {
    if (success) {
      props.toggle();
    }
  }, [success]);

  const handleSubmit = async (values, { setSubmitting }) => {
    addSubcategory(values);
    if (!posting) {
      setSubmitting(false);
    }
  };

  const cat_ids = cats.map((v) => v.category_id);

  return (
    <FormWrapper title="Add Subcategory">
      <Formik
        initialValues={{
          name: '',
          parent_ids: [],
          default_packaging_type: '',
        }}
        validationSchema={Yup.object({
          name: Yup.string().required("Name can't be blank"),
          default_packaging_type: Yup.string(),
        })}
        onSubmit={handleSubmit}
      >
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextInput name="name" label={'Name'} type={'text'} fullWidth />
            </Grid>
            <Grid item xs={12} gutterBottom>
              <MultiSelect
                name="parent_ids"
                label="Categories"
                values={cat_ids}
                valueToDisplayMap={getIdNamePair(cats, 'category_id', 'name')}
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                name="default_packaging_type"
                label="Default Packaging Type"
                values={packaging && packaging.map((v) => v._id)}
                valueToDisplayMap={getIdNamePair(packaging, '_id', 'type')}
              />
            </Grid>
            <Grid item xs={12} container justify={'center'}>
              <PrimaryWallyButton type="submit">
                <Typography>Create</Typography>
              </PrimaryWallyButton>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </FormWrapper>
  );
}

Add.propTypes = {};

export default Add;
