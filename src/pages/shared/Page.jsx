import { Box } from '@material-ui/core';
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
      <Title content={content || title} center />
      <Box width="90%" marginX="auto" mt={2}>
        {children}
      </Box>
    </Box>
  );
}
