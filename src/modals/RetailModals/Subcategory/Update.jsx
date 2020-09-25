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
import { API_SUBCATEGORIES_UPDATE, API_PACKAGING_LIST } from 'config';
import useRequest from 'common/hooks/useRequest';
import useGet from 'common/hooks/useGet';
import usePatch from 'common/hooks/usePatch';
import getIdNamePair from './../getIdNamePair';

const findById = (col, id) => col.find((v) => v._id === id);

function Update({ stores: store, ...props }) {
  // state intended to force re-render on default_packaging_type availability over
  // the network (needed for Select Mui Component)
  const [defaultPackagingType, setDefaultPackagingType] = useState('');

  const id = store.modal.modalData;

  if (!id) {
    return (
      <Typography color="error"> Sorry, we can't update this. </Typography>
    );
  }

  const all_subcategories = useRequest(store, async () =>
    store.retail.getSubcategories(),
  );

  const { data: packaging } = useGet(API_PACKAGING_LIST, store);

  const { name, parent_categories = [], default_packaging_type } =
    findById(all_subcategories, id) || {};

  useEffect(() => {
    setDefaultPackagingType(default_packaging_type);
  }, [default_packaging_type]);

  const all_possible_parents = useRequest(store, async () =>
    store.retail.getCategories(),
  );

  const this_subcat = findById(all_subcategories, id) || {};

  const parent_ids =
    this_subcat.parent_categories &&
    this_subcat.parent_categories.map((v) => v.category_id);

  const [
    updateSubcategory,
    { loading: updating, error: updateError },
  ] = usePatch(API_SUBCATEGORIES_UPDATE, store);

  const handleSubmit = async (values, { setSubmitting }) => {
    updateSubcategory(values);
    if (!updating) {
      setSubmitting(false);
    }
    if (!updating && !updateError) {
      //TODO close the modal automatically - the available method is buggy when used with setTimeout
    }
  };

  return (
    <FormWrapper title="Update Subcategory">
      <Formik
        initialValues={{
          _id: id,
          name,
          parent_ids,
          default_packaging_type: defaultPackagingType,
        }}
        enableReinitialize
        validationSchema={Yup.object({
          name: Yup.string().required("Name can't be blank"),
          parent_ids: Yup.string(),
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
                values={all_possible_parents.map((v) => v.category_id)}
                preSelected={parent_ids}
                valueToDisplayMap={getIdNamePair(
                  all_possible_parents,
                  'category_id',
                  'name',
                )}
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
                <Typography>Update</Typography>
              </PrimaryWallyButton>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </FormWrapper>
  );
}

Update.propTypes = {};

export default Update;
