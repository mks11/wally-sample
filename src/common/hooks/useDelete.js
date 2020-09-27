import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function useDelete(
  API,
  { user: userStore, loading: loadingStore, snackbar },
  onSuccessMsg = 'Request successful!',
  onErrorMsg = 'Request failed, please contact info@thewallyshop.co for assistance.',
) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();

  //
  const [reqInit, setReqInit] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (reqInit && !loading && !error) {
      setSuccess(true);
    }
  }, [error, reqInit, loading]);

  const deleteRequest = () => {
    setLoading(true);
    setReqInit(true);
    loadingStore.show();
    axios
      .delete(API, userStore.getHeaderAuth())
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

  return [deleteRequest, { data, error, loading, success }];
}
