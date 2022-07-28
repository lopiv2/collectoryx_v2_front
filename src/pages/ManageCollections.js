import React, { useState, useEffect } from "react";
import { Typography, Tooltip } from "@mui/material";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardActions, CardMedia } from "@mui/material";
import styles from "../styles/Collections.css";
import BorderLinearProgressBar from "../components/BorderLinearProgressBar";
import { NavLink } from "react-router-dom";
import OptionsService from "../components/DropDownOptions";
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
  const [cascade, setCascade] = useState(false);



  useEffect(() => {
    if (localStorage.getItem("user")) {
      var user = localStorage.getItem("user")
      var userData = JSON.parse(user);
    }
    const collections = ConfigService.getCollectionLists(userData.id)
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
        const collections = ConfigService.getCollectionItemsById(item.id).then(
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
    console.log(cascade)
    const deleteColl = ConfigService.deleteCollection(value, cascade).then(
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

  const getTemplateLabel = (template) => {
    var tempArray = [];
    tempArray = OptionsService.createCollectionOptions.find(
      (f) => f.value === template
    );
    if (tempArray !== undefined) {
      return (tempArray.label.props.id)
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
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
                    color="text.secondary"
                    style={{ fontWeight: 100 }}
                  >{getTemplateLabel(item.template) !== undefined ? intl.formatMessage({
                    id: getTemplateLabel(item.template),
                  }) : null}</Typography>


                  <Typography
                    align="center"
                    sx={{ mb: 0.5 }}
                    color="text.secondary"
                    style={{ fontWeight: 600 }}
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
                    showCascade={true}
                    setCascade={setCascade}
                  >
                    <FormattedMessage id="app.dialog.confirm_delete"></FormattedMessage>
                  </ConfirmDialog>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() =>
                      console.log("Exportar")

                    }
                  >
                    <FormattedMessage id="app.button.export_module"></FormattedMessage>
                  </Button>
                  {/*<Button
                    variant="contained"
                    color="success"
                    onClick={() =>
                      navigate("/collections/edit", {
                        state: {
                          item: item,
                        },
                      })
                    }
                  >
                    <FormattedMessage id="app.button.edit"></FormattedMessage>
                  </Button>*/}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Box >
  );
}

export default ManageCollections;
