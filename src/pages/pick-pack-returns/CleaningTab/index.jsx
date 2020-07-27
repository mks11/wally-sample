import React, {useState, useEffect} from "react";
import axios from 'axios';
import CleaningUpdateForm from "./CleaningUpdateForm";
import CleaningOverview from "./CleaningOverview";
import { Container } from "@material-ui/core";
import {groupBy, mapValues} from "lodash"
import styles from "./CleaningTab.module.css"
import { API_GET_PACKAGING_STOCK } from "../../../config";
import Grid from '@material-ui/core/Grid';

function sortSizes(unsorted_sizes) {
  return unsorted_sizes.sort((size1, size2) => {
    const _parseInt = (v) => parseInt(v.split(/\s+/)[0]);
    return _parseInt(size1) - _parseInt(size2);
  });
}

function reshapeStockArray(stock) {
  const groupedBySize = groupBy(stock, "size");
  const nestedGroupedByType = mapValues(groupedBySize, (grp) =>
    groupBy(grp, "type")
  );
  const collectByStatus = mapValues(nestedGroupedByType, (grp) => {
    return mapValues(grp, (arr) => {
      const final_shape = arr.reduce(
        (acc, curr) => {
          if (!acc.type) {
            acc.type = curr.type;
            acc.size = curr.size;
          }
          const stat = {
            status: curr.status,
            in_stock: curr.in_stock,
          };

          acc.stats.push(stat);
          return acc;
        },
        {
          type: "",
          size: "",
          stats: [],
        }
      );

      return final_shape;
    });
  });

  const allSizes = Object.keys(groupedBySize);
  const allTypes = Object.keys(groupBy(stock, "type"));
  return { collectByStatus, allSizes, allTypes };
}

function CleaningTab(props) {
  const [packagingStocks, setPackagingStocks] = useState([]);
  const [allSizes, setAllSizes] = useState([]);
  const [allTypes, setAllTypes] = useState([]);
  // intended to act as switch to refetch updated data 
  const [needsAFetch, setNeedsAFetch] = useState(true);

  async function getPackagingStocks() {
    const url = API_GET_PACKAGING_STOCK;
    const res = await axios.get(url);
    const { packagingStocks } = res.data;
    return packagingStocks;
  }

  useEffect(() => {
    (async () => {
      if(!needsAFetch){
        return
      }
      const res = await getPackagingStocks();
      const { allSizes, allTypes, collectByStatus } = reshapeStockArray(res);
      setAllSizes(sortSizes(allSizes));
      setAllTypes(allTypes.sort());
      setPackagingStocks(collectByStatus);
      setNeedsAFetch(false)
    })();
  }, [needsAFetch]);

  const handleSuccessfulSubmit = () => {
    setNeedsAFetch(true); // => will trigger the refetch once
  };

  return (
    <Container maxWidth={"lg"}>
      <Grid container justify="flex-start" spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <h2 className={styles.title}>Cleaning</h2>
        </Grid>
        <Grid container justify="center" spacing={2}>
          <Grid item xs={12} sm={10} md={6} lg={6} xl={4}>
            <CleaningUpdateForm
              types={allTypes}
              sizes={allSizes}
              onSuccessfulSubmit={handleSuccessfulSubmit}
            />
          </Grid>
        </Grid>
        <CleaningOverview
          stock={packagingStocks}
          types={allTypes}
          sizes={allSizes}
        />
      </Grid>
    </Container>
  );
}

CleaningTab.propTypes = {};

export default CleaningTab;
