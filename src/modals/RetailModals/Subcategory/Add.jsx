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
import { API_POST_SUBCATEGORIES } from 'config';
import useRequest from '../useRequest';
import usePost from '../usePost';

function Add({ stores: store }, ...props) {
  const cats = useRequest(store, async () => store.retail.getCategories());

  const [
    addSubcategory,
    { loading: formLoading, error: submitError },
  ] = usePost(API_POST_SUBCATEGORIES, store);

  const handleSubmit = async (values, { setSubmitting }) => {
    addSubcategory(values);
    if (!formLoading) {
      setSubmitting(false);
    }
    if (!formLoading && !submitError) {
      props.toggle();
    }
  };

  const getIdNamePair = (collection) => {
    const map = {};
    collection.forEach((col) => {
      map[col._id] = col.name;
    });
    return map;
  };

  const cat_ids = cats.map((v) => v._id);

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
          <Grid item xs={12}>
            <TextInput name="name" label={'Name'} type={'text'} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <MultiSelect
              name="parent_ids"
              label="Categories"
              values={cat_ids}
              valueToDisplayMap={getIdNamePair(cats)}
            />
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <PrimaryWallyButton type="submit">Create</PrimaryWallyButton>
          </Grid>
        </Form>
      </Formik>
    </FormWrapper>
  );
}

Add.propTypes = {};

export default Add;
