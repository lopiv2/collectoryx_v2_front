import React, { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import { FormattedMessage, useIntl, FormattedNumber } from "react-intl";
import { Typography } from "@mui/material";
import { AppContext } from "../AppContext";
import ConfigService from "../../app/api/config.api";
import { CurrencyChecker, SetLocaleDateTime } from "../../utils/generic";
import { format } from "date-fns";

const options = {
  sorting: true,
  exportButton: true,
  headerStyle: { fontWeight: "bold" },
  actionsColumnIndex: -1,
};


export default function RecentOrders() {
  const intl = useIntl();
  const { userData, setUserData } = React.useContext(AppContext);
  const [collectionItems, setCollectionItems] = useState([]);
  const currency = CurrencyChecker();
  const loc = SetLocaleDateTime();

  useEffect(() => {
    const query = {
      id: userData.id,
      orderField: "id",
      search: "",
      orderDirection: "up",
    };
    ConfigService.getRecentCollectionItemsById(query)
      .then((response) => {
        setCollectionItems(response.data.content)
      })
  }, [])


  const data = collectionItems.map((item) => {
    let rows = {
      date: format(new Date(item.adquiringDate), 'P', { locale: loc }),
      id: item.id,
      name: item.name,
      serie: item.serie !== null ? item.serie.name : "",
      collection: item.collection !== null ? item.collection.name : "",
      price:
        <Typography
          color="text.secondary"
          gutterBottom
        >
          {
            <FormattedNumber
              value={item.price}
              style="currency"
              currency={currency.currency}
            />
          }
        </Typography>
    };
    return rows;
  });

  const columns = [
    {
      title: intl.formatMessage({ id: "app.collection.view_collections_item_date" }),
      field: "date",
    },
    {
      title: intl.formatMessage({ id: "app.collection.view_collections_item_name" }),
      field: "name",
    },
    {
      title: intl.formatMessage({ id: "app.collection.view_collections_item_serie" }),
      field: "serie",
    },
    {
      title: intl.formatMessage({ id: "app.collection.view_collections_item_collection" }),
      field: "collection",
    },
    {
      title: intl.formatMessage({ id: "app.collection.view_collections_item_price" }),
      field: "price",
    },
  ];

  return (
    <MaterialTable
      title={
        <Typography sx={{ fontSize: 20, fontWeight: 600 }} color="text.secondary" gutterBottom>
          <FormattedMessage id="app.recent_orders"></FormattedMessage>
        </Typography>
      }
      data={data}
      columns={columns}
      options={options}
    />
  );
}
