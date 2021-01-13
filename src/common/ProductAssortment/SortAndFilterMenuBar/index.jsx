import React, { lazy, Suspense } from 'react';
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';
import { Typography, Box } from '@material-ui/core';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

const SortAndFilterMenu = lazy(() => import('./../SortAndFilterMenu'));

export default function SortAndFilterMenuBar() {
  return (
    <Box
      height="64px"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <ResultsCounter />
      <OpenMenuButton />
    </Box>
  );
}

function OpenMenuButton() {
  const { modalV2: modalV2Store } = useStores();

  const SuspenseFallback = () => (
    <>
      <Typography gutterBottom>Loading...</Typography>
    </>
  );

  const handleClick = () => {
    modalV2Store.open(
      <Suspense fallback={SuspenseFallback()}>
        <SortAndFilterMenu />
      </Suspense>,
      'right',
    );
  };

  return (
    <PrimaryWallyButton onClick={handleClick} variant="outlined">
      Sort & Filter
    </PrimaryWallyButton>
  );
}

const ResultsCounter = observer(() => {
  const { product: productStore } = useStores();
  return (
    <Typography variant="h6" component="p">
      {productStore.filteredProducts.length} Results
    </Typography>
  );
});
