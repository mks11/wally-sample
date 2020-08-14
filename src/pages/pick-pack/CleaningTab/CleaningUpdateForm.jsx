import React, { useState } from "react";
import PropTypes from "prop-types";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import {
  Grid,
  NativeSelect,
  FormControl,
  InputLabel,
  Button,
  Paper,
  FormHelperText,
  Input,
  Typography,
} from "@material-ui/core";
import { connect } from "utils";

import styles from "./CleaningUpdateForm.module.css";
import { PageTitle } from "common/page/Title";
import axios from "axios";
import { API_UPDATE_PACKAGING_STOCK } from "../../../config";

const Select = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <FormControl>
      <InputLabel htmlFor={props.id || props.name}>{label}</InputLabel>
      <NativeSelect className={styles.FormRoot} {...field} {...props} />
      <FormHelperText error={meta.touched && meta.error}>
        {meta.error}
      </FormHelperText>
    </FormControl>
  );
};

const TextField = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <FormControl>
      <InputLabel htmlFor={props.id || props.name}>{label}</InputLabel>
      <Input {...field} {...props} />
      <FormHelperText error={!!(meta.touched && meta.error)}>
        {meta.error}
      </FormHelperText>
    </FormControl>
  );
};

function CleaningUpdateForm({
  store: { modal: modalStore },
  sizes,
  types,
  onSuccessfulSubmit,
}) {
  const [submitFailed, setSubmitFailed] = useState(false);

  const updateStock = async ({ action, size, amount, type }) => {
    return await axios.patch(API_UPDATE_PACKAGING_STOCK, {
      action,
      size,
      type,
      updateAmt: amount,
    });
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitFailed(false);
      const { status, data } = await updateStock(values);
      if ([200, 203].includes(status)) {
        onSuccessfulSubmit(data);
      }
    } catch {
      setSubmitFailed(true);
    } finally {
      setSubmitting(false);
      if (submitFailed) {
        modalStore.toggleModal("error");
      } else {
        modalStore.toggleModal("success");
        resetForm();
      }
    }
  };

  return (
    <Formik
      initialValues={{
        action: "Cleaning",
        size: "",
        amount: 0,
        type: "",
      }}
      validationSchema={Yup.object({
        action: Yup.string().required("Required"),
        size: Yup.string().required("Required"),
        type: Yup.string().required("Required"),
        amount: Yup.number()
          .moreThan(0, () => "The amount should be more than 0.")
          .required("Required"),
      })}
      onSubmit={handleSubmit}
    >
      <Form>
        <Paper className={styles.container} elevation={3}>
          <Typography variant="h2" align="center" gutterBottom>
            Update Packaging Stocks
          </Typography>
          <Grid container justify={"center"} spacing={4}>
            <Grid item>
              <Select name="action" label="Action">
                <option value=""></option>
                <option value="Cleaning">Cleaning</option>
                <option value="New"> New </option>
                <option value="Packaging Return"> Packaging Return </option>
              </Select>
            </Grid>
            <Grid item>
              <Select name="size" label="Size">
                <option value=""></option>
                {sizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </Grid>
            <Grid item>
              <Select name="type" label="Type">
                <option value=""></option>
                {types.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </Select>
            </Grid>
            <Grid item>
              <TextField
                id="updateAmt"
                name="amount"
                type="number"
                label={"Update Amount"}
              />
            </Grid>
          </Grid>

          <Grid
            container
            justify={"space-around"}
            spacing={1}
            className={styles.buttonContainer}
          >
            <Button
              variant={"outlined"}
              type={"submit"}
              className={styles.button}
            >
              <Typography variant="body1">Submit</Typography>
            </Button>
          </Grid>
        </Paper>
      </Form>
    </Formik>
  );
}
CleaningUpdateForm.propTypes = {
  sizes: PropTypes.arrayOf(PropTypes.string),
  types: PropTypes.arrayOf(PropTypes.string),
  onSuccessfulSubmit: PropTypes.func.isRequired,
};

// needed to wrap it because connect("store") on CleaningUpdateForm
// gives 'invalid hook call' error
class _CleaningUpdateForm extends React.Component {
  render() {
    return <CleaningUpdateForm {...this.props} />;
  }
}

export default connect("store")(_CleaningUpdateForm);
