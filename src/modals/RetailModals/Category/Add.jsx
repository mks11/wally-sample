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
import { API_CATEGORIES_POST } from 'config';
import useRequest from 'common/hooks/useRequest';
import usePost from 'common/hooks/usePost';

function Add({ stores: store }, toggle, ...props) {
  const subc = useRequest(store, async () => store.retail.getSubcategories());
  const [addCategory, { loading: posting, error: postError }] = usePost(
    API_CATEGORIES_POST,
    store,
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    addCategory(values);
    if (!posting) {
      setSubmitting(false);
    }
    if (!posting && !postError) {
      toggle && toggle(); // close the modal
    }
  };

  const getIdNamePair = (collection) => {
    const map = {};
    collection.forEach((col) => {
      map[col._id] = col.name;
    });
    return map;
  };

  const subc_ids = subc.map((v) => v._id);

  return (
    <FormWrapper title="Add Category">
      <Formik
        initialValues={{
          name: '',
          child_ids: [],
        }}
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
              values={subc_ids}
              valueToDisplayMap={getIdNamePair(subc)}
            />
          </Grid>
          <Grid item xs={12} container justify="center">
            <PrimaryWallyButton type="submit">
              <Typography>Create</Typography>
            </PrimaryWallyButton>
          </Grid>
        </Form>
      </Formik>
    </FormWrapper>
  );
}

Add.propTypes = {};

export default Add;
