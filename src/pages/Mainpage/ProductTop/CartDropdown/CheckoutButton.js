import React from "react";
import { Typography, Button } from "@material-ui/core";
import { ShoppingCart } from "@material-ui/icons";
import PropTypes from "prop-types";
import styles from "./CheckoutButton.module.css";

export default function CheckoutButton({ count, onCheckout, ...rest }) {
  return (
    <Button
      className={`${styles["product-cart-counter"]} ${
        count > 0 ? "active" : ""
      }`}
      disabled={count < 1}
      onClick={onCheckout}
      {...rest}
    >
      <ShoppingCart />
      <Typography component="span" variant="h2">
        <strong>
          {count} {count > 1 ? "Items" : "Item"}
        </strong>
      </Typography>
    </Button>
  );
}

CheckoutButton.propTypes = {
  count: PropTypes.number.isRequired,
  onCheckout: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};
