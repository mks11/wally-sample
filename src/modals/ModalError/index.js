import React from 'react';

// Components
import { ErrorText } from 'styled-component-lib/Typography';
export default function ErrorModal({ stores, ...props }) {
  const { modal } = stores;

  return (
    <div className="login-wrap">
      <ErrorText variant="h2" component="h1" gutterBottom>
        Oops!
      </ErrorText>
      <p className="mb-5 info-popup">
        {modal.msg ||
          'Something went wrong during your request. Please try again later.'}
      </p>
    </div>
  );
}
