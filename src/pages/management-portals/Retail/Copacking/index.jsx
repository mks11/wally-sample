import React, { useState } from 'react';

// API
import { uploadScannedProducts } from 'api/copackingRound';

// Material UI
import { Box, Typography } from '@material-ui/core';

// MobX
import { useStores } from 'hooks/mobx';

// Styled Components
import { ActivityButton } from 'styled-component-lib/Buttons';

function CopackingRound() {
  const { snackbar: snackbarStore, user: userStore } = useStores();
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadProducts = async () => {
    setIsUploading(true);

    try {
      if (userStore.user && userStore.token) {
        const auth = userStore.getHeaderAuth();
        await uploadScannedProducts(auth);
        snackbarStore.openSnackbar('Upload Successful', 'success');
      }
    } catch (error) {
      console.log(error);
      snackbarStore.openSnackbar('Upload Failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        Copacking Rounds
      </Typography>
      <Box>
        <ActivityButton
          isLoading={isUploading}
          disabled={isUploading}
          loadingTitle="Upload in Progress "
          onClick={handleUploadProducts}
        >
          Upload Scanned Products
        </ActivityButton>
      </Box>
    </Box>
  );
}

CopackingRound.propTypes = {};

export default CopackingRound;
