import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Container } from "@material-ui/core";
import styles from "./Page.module.css";

function Page({ title, children, ...rest }) {
  return (
    <Container maxWidth={"sm"} {...rest}>
      <h2 className={styles.title}>{title}</h2>
      <Fragment>{children}</Fragment>
    </Container>
  );
}

Page.propTypes = {
  children: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default Page;
