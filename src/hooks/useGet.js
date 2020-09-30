import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useGet(
  API,
  { user: userStore, loading: loadingStore, snackbar },
  onErrorMsg = 'A problem occurred in loading this page.',
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
        snackbar.openSnackbar(onErrorMsg, 'error');
      })
      .finally(() => {
        setTimeout(loadingStore.hide(), 300);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
