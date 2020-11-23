import { Box, Container } from '@material-ui/core';
import React from 'react';
import Head from '../../common/Head';
import Title from '../../common/page/Title';

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
      <Head title={title} description={description} />
      {title && (
        <Typography variant="h1" gutterBottom>
          {title}
        </Typography>
      )}
      <Container maxWidth="xl">{children}</Container>
    </Box>
  );
}
