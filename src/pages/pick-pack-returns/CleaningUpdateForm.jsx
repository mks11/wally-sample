import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Formik, Form, ErrorMessage, useField } from "formik";
import * as Yup from "yup";
import {
  Grid,
  NativeSelect,
  FormControl,
  InputLabel,
  Button,
  Container,
  Paper,
  FormHelperText,
  Input,
  Typography,
} from "@material-ui/core";
import {connect} from "utils"

import styles from "./CleaningUpdateForm.module.css"
import axios from "axios";
import {API_UPDATE_PACKAGING_STOCK}  from "./../../config"

const Select = ({ label, classNames, ...props }) => {
  if (classNames) {
    // add it if needed
    throw new Error("Unimplemented!");
  }
  const [field, meta] = useField(props);
  return (
    <FormControl>
      <InputLabel htmlFor={props.id || props.name}>{label}</InputLabel>
      <NativeSelect className={styles["FormRoot"]} {...field} {...props} />
      <FormHelperText error={meta.touched && meta.error}>
        {meta.error}
      </FormHelperText>
    </FormControl>
  );
};

const TextField = ({ label, classNames, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <FormControl>
      <InputLabel htmlFor={props.id || props.name}>{label}</InputLabel>
      <Input {...field} {...props} />
      <FormHelperText error={!!(meta.touched && meta.error)}>
        {meta.error}
      </FormHelperText>
    </FormControl>
    // <TextField
    //   htmlFor={props.id || props.name}
    //   label={label}
    //   type={"number"}
    //   error={!!(meta.touched && meta.error)}
    //   helperText={meta.error}
    //   {...field}
    //   {...pr}
    // />
  );
};



function CleaningUpdateForm({ store: {modal: modalStore}, sizes, types }) {
  const [submitFailed, setSubmitFailed] = useState(false) 
  const [showModal, setShowModal] = useState(false)

  const updateStock = async ({action, size, amount, type}) => {
    await axios.patch(API_UPDATE_PACKAGING_STOCK, {
      action,
      size,
      type,
      updateAmt: amount
    })
  }

  const handleSubmit =  async (values, { setSubmitting, resetForm}) => {
    try{
      setSubmitFailed(false)
      await updateStock(values)
    } catch {
      setSubmitFailed(true)
    } finally {
      setSubmitting(false)
      if(submitFailed){
        modalStore.toggleModal("error")
      } else {
        modalStore.toggleModal("success")
        resetForm()
      }
    }
  }

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
        <Paper style={{ padding: "2rem" }} elevation={1}>
          <Grid
            container
            justify={"space-between"}
            spacing={1}
          >
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
              <Select name="type" label="type">
                <option value=""></option>
                {types.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </Select>
            </Grid>
          </Grid>
          <Grid
            container
            justify={"flex-start"}
            spacing={1}
            style={{ marginTop: "2rem" }}
          >
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
            style={{ marginTop: "2rem" }}
          >
            <Button
              variant={"outlined"}
              type={"submit"}
              style={{ padding: "0.25rem 1.5rem" }}
            >
              Submit
            </Button>
          </Grid>
        </Paper>
      </Form>
    </Formik>
  );
}
CleaningUpdateForm.propTypes = {
  sizes: PropTypes.arrayOf(PropTypes.string),
  types: PropTypes.arrayOf(PropTypes.string)
};

// needed to wrap it because connect("store") on CleaningUpdateForm
// gives 'invalid hook call' error
class _CleaningUpdateForm extends React.Component{
  render(){
    return <CleaningUpdateForm  {...this.props}/>
  }
}

export default connect("store")(_CleaningUpdateForm);
