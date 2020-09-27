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
import getIdNamePair from './../getIdNamePair';

function Add({ stores: store, ...props }) {
  const subc = useRequest(store, async () => store.retail.getSubcategories());
  const [addCategory, { success, loading: posting }] = usePost(
    API_CATEGORIES_POST,
    store,
  );

  useEffect(() => {
    if (success) {
      props.toggle();
    }
  }, [success]);

  const handleSubmit = async (values, { setSubmitting }) => {
    addCategory(values);
    if (!posting) {
      setSubmitting(false);
    }
  };

  const subc_ids = subc.map((v) => v.category_id);

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
              valueToDisplayMap={getIdNamePair(subc, 'category_id', 'name')}
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
