import React, { useState, useRef, useEffect } from 'react';
import {
  AsYouType,
  parseIncompletePhoneNumber,
  formatIncompletePhoneNumber,
} from 'libphonenumber-js';
import { TextField } from '@material-ui/core';

export default function PhoneInput({ onValidate, onChange, ...rest }) {
  const [val, setVal] = useState('');

  const asYouTypeRefContainer = useRef(null);
  asYouTypeRefContainer.current = new AsYouType('US');
  const asYouType = asYouTypeRefContainer.current;

  const handleChange = (e) => {
    //issue with not able to delete the parenthesis on backspace
    //fix from the maintainer https://github.com/catamphetamine/libphonenumber-js/issues/225
    const newVal = parseIncompletePhoneNumber(e.target.value);
    const oldVal = parseIncompletePhoneNumber(val);
    const fmtVal = formatIncompletePhoneNumber(newVal, 'US');

    // if newVal equals oldVal, means the new key wasn't registered
    // (which could be a backspace), in that case set the oldValue
    // without formatting allowing for deletion
    if (newVal === oldVal) {
      setVal(oldVal);
    } else {
      setVal(fmtVal);
    }
    onValidate && onValidate(asYouType.isValid(e.target.value));
  };

  // send back always the latest ***UNFORMATTED*** phone number - no brackets etc
  useEffect(() => {
    onChange && onChange(parseIncompletePhoneNumber(val));
  }, [val]);

  return <TextField type="tel" value={val} onChange={handleChange} {...rest} />;
}
