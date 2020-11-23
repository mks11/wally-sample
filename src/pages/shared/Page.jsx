import { Box, Container, Typography } from '@material-ui/core';
import React from 'react';
import Head from '../../common/Head';

export default function Page({
  children,
  style,
  title,
  description,
  content,
  ...rest
}) {
  return (
    <Box style={style} {...rest}>
      <Container maxWidth="xl">
        <Head title={title} description={description} />
        {title && (
          <Box my={4}>
            <Typography variant="h1">{title}</Typography>
          </Box>
        )}
        {children}
      </Container>
    </Box>
  );
}
