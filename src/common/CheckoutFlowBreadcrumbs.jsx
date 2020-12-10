import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

const CheckoutFlowBreadcrumbs = ({ breadcrumbs, location }) => {
  const theme = useTheme();
  if (breadcrumbs.length <= 1) return null;
  return (
    <div>
      {/* Link back to any previous steps of the breadcrumb. */}
      {breadcrumbs.map(({ name, path }, idx) => {
        const isCurrentPath = location.pathname.includes(name) ? true : false;

        return (
          <Box component="span" key={name}>
            <Box component="span" mr={1}>
              {isCurrentPath ? (
                <Typography component="span">{name}</Typography>
              ) : (
                <Link to={path} style={{ color: theme.palette.primary.main }}>
                  <Typography component="span">{name}</Typography>
                </Link>
              )}
            </Box>
            {idx < breadcrumbs.length - 1 ? (
              <Box component="span" mr={1}>
                &gt;
              </Box>
            ) : null}
          </Box>
        );
      })}
    </div>
  );
};

export default CheckoutFlowBreadcrumbs;
