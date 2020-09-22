import React, { useEffect, useState } from 'react';

export default function useRequest(
  { loading, snackbar },
  async_call,
  onErrorMsg = 'There was an error. Please contact info@thewallyshop.co for assistance.',
) {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        loading.show();
        const data = await async_call();
        setData(data);
      } catch (e) {
        snackbar.openSnackbar(e.message, 'error');
      } finally {
        loading.hide();
      }
    })();
  }, []);

  return data;
}
