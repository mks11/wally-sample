import { Box, Container } from '@material-ui/core';
import React from 'react';
import Head from 'common/Head';

export default function Page({
  content,
  children,
  description,
  maxWidth = 'xl',
  style,
  title,
  ...rest
}) {
  return (
    <Box style={style} {...rest}>
      <Container maxWidth={maxWidth}>
        <Head title={title} description={description} />
        {children}
      </Container>
    </Box>
  );
}
