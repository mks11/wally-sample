import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Container } from "@material-ui/core";
import styles from "./Tab.module.css";

function Tab({ title, children, ...rest }) {
  return (
    <Container maxWidth={"sm"} {...rest}>
      <h2 className={styles.title}>{title}</h2>
      <Fragment>{children}</Fragment>
    </Container>
  );
}

Tab.propTypes = {
  children: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default Tab;
