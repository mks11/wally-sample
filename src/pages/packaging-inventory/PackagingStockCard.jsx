import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Grid,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Table,
  Typography,
} from '@material-ui/core';
import styles from './PackagingStockCard.module.css';
import styled from 'styled-components';
import { PageTitle } from 'common/page/Title';

const TCell = styled(TableCell)`
  &&& {
    text-align: start !important;
  }
`;

export default function StockCard({ title, stat = [], ...rest }) {
  return (
    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
      <Card className={styles.headlineCard} {...rest}>
        <PageTitle variant="h2" align="center">
          {title}
        </PageTitle>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className={styles.tableHeadRow}>
                  <TCell>
                    <Typography variant="h3">Status</Typography>
                  </TCell>
                  <TCell align={'left'}>
                    <Typography variant="h3">In Stock</Typography>
                  </TCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stat.stats &&
                  stat.stats.map((v) => (
                    <TableRow key={`${v.status}${v.in}`}>
                      <TableCell align={'left'}>
                        <Typography variant="body1">{v.status}</Typography>
                      </TableCell>
                      <TableCell align={'left'}>
                        <Typography variant="body1" align={'left'}>
                          {v.in_stock}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Grid>
  );
}

StockCard.propTypes = {
  title: PropTypes.string.isRequired,
  stat: PropTypes.shape({
    stats: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.string,
        in_stock: PropTypes.number,
      }),
    ),
  }),
  hideOnNone: PropTypes.bool,
  style: PropTypes.object,
};
