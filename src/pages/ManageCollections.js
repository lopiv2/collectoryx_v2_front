import React, { useState, useEffect } from "react";
import { Typography, Tooltip } from "@mui/material";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardActions, CardMedia } from "@mui/material";
import styles from "../styles/Collections.css";
import BorderLinearProgressBar from "../components/BorderLinearProgressBar";
import { NavLink } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import AddIcon from "@mui/icons-material/Add";
import ConfirmDialog from "../components/ConfirmDialog";

function ManageCollections(props) {
  const [collectionsList, setCollectionsList] = useState([]);
  const navigate = useNavigate();
  const [col, setCol] = useState([]);
  const breadcrumbs = useBreadcrumbs();
  const intl = useIntl();
  const [value, setValue] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const collections = ConfigService.getCollectionLists()
      .then((response) => {
        setCollectionsList(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (collectionsList.length > 0) {
      collectionsList.map((item) => {
        const collections = ConfigService.getCollectionById(item.id).then(
          (response) => {
            let collected = 0;
            let totalItems = 0;
            response.data.map((item) => {
              if (item.own) {
                collected = collected + 1;
              }
            });
            totalItems = response.data.length;
            const items = {
              id: item.id,
              collected: collected,
              totalItems: totalItems,
            };
            setCol((col) => [...col, items]);
          }
        );
      });
    }
  }, [collectionsList]);

  const handleDeleteClick = () => {
    const deleteColl = ConfigService.deleteCollection(value).then(
      (response) => {
        if (response.data === true) {
          toast.success(
            <FormattedMessage id="app.collection.item-deleted"></FormattedMessage>,
            { theme: "colored" }
          );
          var index = collectionsList.findIndex(
            (collectionsList) => collectionsList.id === value
          );
          if (index > -1) {
            collectionsList.splice(index, 1);
            setCollectionsList([...collectionsList]);
          }
        }
      }
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <ToastContainer autoClose={2000} />
      <Grid>
        {/*breadcrumbs.map(({
          match,
          breadcrumb
        }) => (
          <span key={match.pathname}>
             / 
            <NavLink to={match.pathname}>{breadcrumb}</NavLink>
          </span>
        ))*/}
        <Grid item xs={6}>
          <Typography variant="h4" component="h4">
            <FormattedMessage id="app.collection.manage_collections_title"></FormattedMessage>
          </Typography>
        </Grid>
        <Grid container>
          <Grid item mt={"1px"} mb={"10px"}>
            <Tooltip
              title={intl.formatMessage({
                id: "app.tooltip.add_new_collection",
              })}
              placement="top"
              arrow
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/collections/add")}
              >
                <AddIcon></AddIcon>
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container spacing={10} className="container">
          {collectionsList.map((item) => (
            <Grid item key={item.id}>
              <Card
                sx={{ height: 400, minWidth: 250, maxWidth: 250, boxShadow: 5 }}
                ml={200}
              >
                <CardContent>
                  {item.logo ? null : (
                    <Typography
                      align="center"
                      sx={{ fontSize: 20 }}
                      color="text.primary"
                      gutterBottom
                    >
                      {item.name}
                    </Typography>
                  )}
                  <Typography variant="h5" component="div"></Typography>
                  {item.logo != null && (
                    <CardMedia
                      component="img"
                      width="100%"
                      image={require("../../../images/" + item.logo.path)}
                      alt={item.name}
                      className="card-collection"
                      style={styles}
                    />
                  )}

                  <Typography
                    align="center"
                    sx={{ mb: 0.5 }}
                    mt={1}
                    color="text.secondary"
                  >
                    <FormattedMessage id="app.collection.items"></FormattedMessage>
                  </Typography>
                  <Typography align="center" color="text.secondary">
                    {col[col.findIndex((e) => e.id === item.id)]
                      ? col[col.findIndex((e) => e.id === item.id)].collected +
                        "/" +
                        col[col.findIndex((e) => e.id === item.id)].totalItems
                      : null}
                  </Typography>
                  <BorderLinearProgressBar
                    variant="determinate"
                    value={
                      col[col.findIndex((e) => e.id === item.id)]
                        ? +Number.parseFloat(
                            (col[col.findIndex((e) => e.id === item.id)]
                              .collected /
                              col[col.findIndex((e) => e.id === item.id)]
                                .totalItems) *
                              100
                          ).toFixed(2)
                        : 0
                    }
                  ></BorderLinearProgressBar>
                </CardContent>
                <CardActions style={{ justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    color="error"
                    type="submit"
                    form="form"
                    value={item.id}
                    onClick={() => {
                      setValue(item.id);
                      setConfirmOpen(true);
                    }}
                  >
                    <FormattedMessage id="app.button.delete"></FormattedMessage>
                  </Button>
                  <ConfirmDialog
                    title={intl.formatMessage({
                      id: "app.dialog.delete_title",
                    })}
                    open={confirmOpen}
                    setOpen={setConfirmOpen}
                    onConfirm={handleDeleteClick}
                  >
                    <FormattedMessage id="app.dialog.confirm_delete"></FormattedMessage>
                  </ConfirmDialog>
                  <NavLink
                    to={{ pathname: `/collections/${item.name}` }}
                    state={{ id: item.id, logo: item.logo, name: item.name }}
                    style={{ textDecoration: "none" }}
                  >
                    <Button variant="contained">
                      <FormattedMessage id="app.button.edit"></FormattedMessage>
                    </Button>
                  </NavLink>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ManageCollections;
