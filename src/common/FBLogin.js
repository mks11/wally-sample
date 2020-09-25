import React, { useState } from 'react';

// Config
import { FB_KEY } from 'config';
import { support } from 'config';

// mobx
import { useStores } from 'hooks/mobx';

// Custom Components
import FacebookLogin from 'react-facebook-login';

function FBLogin({ ...props }) {
  const { store } = useStores();
  const [isRequesting, setIsRequesting] = useState(false);

  const login = (responseData) => {
    if (!isRequesting) {
      setIsRequesting(true);

      const { additionalData } = props;
      const data = { ...responseData, ...additionalData };

      store.user
        .loginFacebook(data)
        .then(() => store.routing.push('/main'))
        .catch(() => {
          store.snackbar.openSnackbar(
            `Attempt to login via facebook failed. Contact us at ${support} for support.`,
          );
        })
        .finally(() => {
          setIsRequesting(false);
          store.modalV2.close();
        });
    }
  };

  return (
    <FacebookLogin
      appId={FB_KEY}
      cssClass={`btn btn-blue-fb ${isRequesting ? 'inactive' : ''}`}
      autoLoad={false}
      textButton="Facebook"
      fields="name,email,picture"
      scope="public_profile,email"
      callback={login}
      disableMobileRedirect={true}
      isDisabled={isRequesting}
    />
  );
}

export default FBLogin;
