import React, { useState } from 'react';
import axios from 'axios';
import { MobxProviderContext } from 'mobx-react';

export default function usePost(
  API,
  { user: userStore, loading: loadingStore, snackbar },
  onSuccessMsg = 'Request successful!',
  onErrorMsg = 'Request failed, please contact info@thewallyshop.co for assistance.',
) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();

  const submit = (payload) => {
    setLoading(true);
    loadingStore.show();
    axios
      .post(
        API,
        {
          data: payload,
        },
        userStore.getHeaderAuth(),
      )
      .then(({ data }) => {
        setData(data);
        snackbar.openSnackbar(onSuccessMsg, 'success');
      })
      .catch((e) => {
        setError(e);
        snackbar.openSnackbar(e.message, 'error');
      })
      .finally(() => {
        setTimeout(loadingStore.hide(), 300);
        setLoading(false);
      });
  };

  return [submit, { data, error, loading }];
}
