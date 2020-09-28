import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function useGet(
  API,
  { user: userStore, loading: loadingStore, snackbar },
  onErrMsg = 'A problem occurred in loading this page.',
) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    loadingStore.show();
    axios
      .get(API, userStore.getHeaderAuth())
      .then(({ data }) => {
        setData(data);
      })
      .catch((e) => {
        setError(e);
        snackbar.openSnackbar(e.message, 'error');
      })
      .finally(() => {
        setTimeout(loadingStore.hide(), 300);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
