import React, { useState } from 'react';

// Config
import { FB_KEY } from 'config';
import { support } from 'config';

// mobx
import { useStores } from 'hooks/mobx';

// Custom Components
import FacebookLogin from 'react-facebook-login';

function FBLogin({ ...props }) {
  const { modalV2, user, routing, snackbar } = useStores();
  const [isRequesting, setIsRequesting] = useState(false);

  const login = (responseData) => {
    if (!isRequesting) {
      setIsRequesting(true);

      const { additionalData } = props;
      const data = { ...responseData, ...additionalData };

      user
        .loginFacebook(data)
        .then(() => routing.push('/main'))
        .catch(() => {
          snackbar.openSnackbar(
            `Attempt to login via facebook failed. Contact us at ${support} for support.`,
          );
        })
        .finally(() => {
          setIsRequesting(false);
          modalV2.close();
        });
    }
  };

  return (
    <FacebookLogin
      appId={FB_KEY}
      cssClass={`btn btn-blue-fb ${isRequesting ? 'inactive' : ''}`}
      autoLoad={false}
      textButton="Continue With Facebook"
      fields="name,email,picture"
      scope="public_profile,email"
      callback={login}
      disableMobileRedirect={true}
      isDisabled={isRequesting}
    />
  );
}

export default FBLogin;
