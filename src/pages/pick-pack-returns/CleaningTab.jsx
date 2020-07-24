import React, { useState, useEffect } from "react";
import axios from "axios";
import CleaningUpdateForm from "./CleaningUpdateForm";
import CleaningOverview from "./CleaningOverview";
import { groupBy, mapValues } from "lodash";
import { API_GET_PACKAGING_STOCK } from "../../config";
import Tab from "./shared/Page";

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

  async function getPackagingStocks() {
    // return new Promise((res, rej) => {
    //   setTimeout(() => {
    //     res([
    //       { type: "jar", size: "10 Oz", status: "cleaned", in_stock: 100 },
    //       { type: "lid", size: "25 Oz", status: "out", in_stock: 90 },
    //       { type: "jar", size: "10 Oz", status: "unwashed", in_stock: 200 },
    //       { type: "lid", size: "15 Oz", status: "packed", in_stock: 1 },
    //       { type: "lid", size: "15 Oz", status: "out", in_stock: 20 },
    //       { type: "lid", size: "1 Oz", status: "out", in_stock: 20 },
    //       { type: "bottle", size: "1 Oz", status: "out", in_stock: 20 },
    //     ]);
    //   }, 300);
    // });

    const url = API_GET_PACKAGING_STOCK;
    const res = await axios.get(url);
    const { packagingStocks } = res.data;
    return packagingStocks;
  }

  useEffect(() => {
    (async () => {
      const res = await getPackagingStocks();
      const { allSizes, allTypes, collectByStatus } = reshapeStockArray(res);
      setAllSizes(sortSizes(allSizes));
      setAllTypes(allTypes.sort());
      setPackagingStocks(collectByStatus);
    })();
  }, []);

  return (
    <Tab title="Cleaning">
      <CleaningUpdateForm types={allTypes} sizes={allSizes} />
      <CleaningOverview
        stock={packagingStocks}
        types={allTypes}
        sizes={allSizes}
      />
    </Tab>
  );
}

export default CleaningTab;
