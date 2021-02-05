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

const OpenMenuButton = observer(() => {
  const { modalV2: modalV2Store, product: productStore } = useStores();

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

  const isDisabled = productStore.products && productStore.products.length < 1;

  return (
    <PrimaryWallyButton
      onClick={handleClick}
      disabled={isDisabled}
      variant="outlined"
    >
      Sort & Filter
    </PrimaryWallyButton>
  );
});

const ResultsCounter = observer(() => {
  const { product: productStore } = useStores();
  const { filteredProducts } = productStore;
  const formatResults = (products) => {
    return products.length === 1 ? ' Result' : ' Results';
  };

  return (
    <Typography variant="h6" component="p">
      {filteredProducts.length + formatResults(filteredProducts)}
    </Typography>
  );
});
