import React from "react";
import PropTypes from "prop-types";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Table,
} from "@material-ui/core"
import tabStyles from "./CleaningTab.module.css"
import styles from "./CleaningStockCard.module.css"

export default function StockCard({ title, stat = [], ...rest }) {
  return (
    <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
      <Card className={styles.headlineCard} {...rest}>
        <div className={styles.headlineContainer}>
          <h2 className={tabStyles.title}>{title}</h2>
        </div>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className={styles.tableHeadRow}>
                  <TableCell className={styles.tableHead}>Status</TableCell>
                  <TableCell align={"left"} className={styles.tableHead}>
                    In Stock
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stat.stats &&
                  stat.stats.map((v) => (
                    <TableRow key={`${v.status}${v.in}`}>
                      <TableCell align={"left"}>
                        <Typography>{v.status}</Typography>
                      </TableCell>
                      <TableCell align={"left"}>
                        <Typography align={"left"} component="h4">
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
  )
}

StockCard.propTypes = {
  title: PropTypes.string.isRequired,
  stat: PropTypes.shape({
    stats: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.string,
        in_stock: PropTypes.number,
      })
    ),
  }),
  hideOnNone: PropTypes.bool,
  style: PropTypes.object,
};
