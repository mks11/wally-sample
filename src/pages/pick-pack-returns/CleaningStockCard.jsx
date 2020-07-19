import React from "react";
import PropTypes from "prop-types";
import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Table,
} from "@material-ui/core";
import styles from "./CleaningTab.module.css"

export default function StockCard({ title, stat = [], ...rest }) {
  return (
    <Card {...rest} style={{ marginTop: "2rem", marginBottom: "1rem" }}>
      <div style={{textAlign:"center", marginTop: "1rem"}}>
        <h2 style={styles['.title']}>{title}</h2>
      </div>
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell align={"right"}>In Stock </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stat.stats &&
                stat.stats.map((v) => (
                  <TableRow key={`${v.status}${v.in}`}>
                    <TableCell align={"left"}>
                      <Typography>{v.status}</Typography>
                    </TableCell>
                    <TableCell align={"right"}>
                    <Typography align={"right"} component="h4">
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
  );
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
