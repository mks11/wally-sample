import React from 'react';

// Components
import { SuccessText } from 'styled-component-lib/Typography';

export default function Success({ stores, ...props }) {
  const { modal } = stores;

  return (
    <div className="login-wrap">
      <SuccessText variant="h2" component="h1" gutterBottom>
        Success!
      </SuccessText>
      <p className="mb-5 info-popup">
        {modal.msg || 'Your request was successful!'}
      </p>
    </div>
  );
}
