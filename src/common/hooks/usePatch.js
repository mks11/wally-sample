import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function usePatch(
  API,
  { user: userStore, loading: loadingStore, snackbar },
  onSuccessMsg = 'Request successful!',
  onErrorMsg = 'Request failed, please contact info@thewallyshop.co for assistance.',
) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();

  // part that determines if the success
  const [reqInitiated, setReqInitiated] = useState(false);
  const [success, setSuccess] = useState();

  useEffect(() => {
    if (reqInitiated && !loading && !error) {
      setSuccess(true);
    }
  }, [loading, error, reqInitiated]);

  const update = (payload) => {
    setReqInitiated(true);
    setLoading(true);
    loadingStore.show();
    axios
      .patch(API, payload, userStore.getHeaderAuth())
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

  return [update, { data, error, loading, success }];
}
