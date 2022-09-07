import React, { useState, useEffect, useRef } from "react";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";
import {
  Avatar,
  Typography,
  Tooltip,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import OwnImage from "../images/Own.png";
import NotOwnImage from "../images/NotOwn.png";
import Tick from "../images/Tick.png";
import Cross from "../images/Cross.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardActions, CardMedia } from "@mui/material";
import styles from "../styles/Collections.css";
import BorderLinearProgressBar from "../components/BorderLinearProgressBar";
import { useLocation } from "react-router-dom";
import LogoDisplay from "../components/LogoDisplay";
import { CurrencyChecker } from "../utils/generic";
import Dialog from "@material-ui/core/Dialog";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ConfirmDialog from "../components/ConfirmDialog";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import MaterialTable from "@material-table/core";
import IconButton from "@mui/material/IconButton";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function DisplayCollection(props) {
  const [collectionItems, setCollectionItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [collected, setCollected] = useState(0);
  const [wished, setWished] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [moneySpent, setMoneySpent] = useState(0);
  const currency = CurrencyChecker();
  const [open, setOpen] = useState(false);
  const [openNewItem, setOpenNewItem] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const intl = useIntl();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [imageClicked, setImageClicked] = useState(null);
  const [cardHover, setCardHover] = useState(null);
  const [toggleView, setToggleView] = useState("grid");
  const breadcrumbs = useBreadcrumbs();
  const [collectionId, setCollectionId] = useState();
  let isMounted = useRef(false);

  function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;
    const [templateSelected, setTemplateSelected] = useState("new");

    const handleClose = () => {
      onClose(selectedValue);
    };

    const checkOptions = () => {
      if (templateSelected === "new") {
        navigate("/collections/add-item", {
          state: { id: collectionId, name: location.state.name },
        })
      }
      if (templateSelected === "file") {
        navigate("/collections/import-scrapper", {
          state: { id: collectionId, name: location.state.name },
        })
      };
    }

    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>
          <FormattedMessage id="app.collection.select_option"></FormattedMessage>
        </DialogTitle>
        <Grid container>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue={templateSelected}
            name="radio-buttons-group"
            value={templateSelected}
            onChange={(e) => {
              setTemplateSelected(e.target.value);
            }}
          >
            <Grid item ml={2}>
              <FormControlLabel
                value="new"
                control={<Radio />}
                label={intl.formatMessage({
                  id: "app.collection.add_collection_empty",
                })}
              />
            </Grid>
            <Grid item ml={2}>
              <FormControlLabel
                value="file"
                control={<Radio />}
                label={intl.formatMessage({
                  id: "app.collection.add_collection_import_scrapper",
                })}
              />
            </Grid>
            <Grid item ml={2}>
              <FormControlLabel
                value="shop"
                control={<Radio />}
                label={intl.formatMessage({
                  id: "app.collection.add_collection_import_shop",
                })}
              />
            </Grid>
            <Grid container style={{ justifyContent: "center" }}>
              <Grid ml={2} mb={2}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={checkOptions}
                >
                  <FormattedMessage id="app.button.accept"></FormattedMessage>
                </Button>
              </Grid>
              <Grid ml={2}>
                <Button variant="contained" color="error" onClick={onClose}>
                  <FormattedMessage id="app.button.cancel"></FormattedMessage>
                </Button>
              </Grid>
            </Grid>
          </RadioGroup>
        </Grid>
      </Dialog>
    );
  }

  SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
  };

  const handleCloseNewCol = () => {
    setOpenNew(false);
  };

  useEffect(() => {
    const collections = ConfigService.getCollectionItemsById(location.state.id)
      .then((response) => {
        let col = 0;
        let money = 0;
        let want = 0;
        if (isMounted) {
          setCollectionItems(response.data);
          setTotalItems(response.data.length);
          response.data.map((item) => {
            if (item.own) {
              col = col + 1;
              money = money + item.price;
            }
            if (item.wanted) {
              want = want + 1;
            }
          });
          setMoneySpent(money);
          setCollected(col);
          setWished(want);
          setCollectionId(location.state.id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleWishClick = (event, own, wanted) => {
    const toggle = ConfigService.toggleItemWish(
      event.currentTarget.id,
      own,
      wanted
    ).then((response) => {
      var index = collectionItems.findIndex(
        (collectionItems) => collectionItems.id === response.data.id
      );
      let newItems = [...collectionItems];
      newItems[index].wanted = response.data.wanted;
      if (response.data.wanted) {
        setWished(wished + 1);
      } else {
        setWished(wished - 1);
      }
      setCollectionItems(newItems);
    });
  };

  const handleOwnClick = (event, own, wanted) => {
    const toggle = ConfigService.toggleItemOwn(
      event.currentTarget.id,
      own,
      wanted
    ).then((response) => {
      var index = collectionItems.findIndex(
        (collectionItems) => collectionItems.id === response.data.id
      );
      let newItems = [...collectionItems];
      newItems[index].own = response.data.own;
      if (response.data.own) {
        setMoneySpent(moneySpent + response.data.price);
        setCollected(collected + 1);
      } else {
        setMoneySpent(moneySpent - response.data.price);
        setCollected(collected - 1);
      }
      setCollectionItems(newItems);
    });
  };

  const handleDeleteClick = () => {
    const deleteItem = ConfigService.deleteCollectionItem(value).then(
      (response) => {
        if (response.data === true) {
          toast.success(
            <FormattedMessage id="app.collection.item-deleted"></FormattedMessage>,
            { theme: "colored" }
          );
          var index = collectionItems.findIndex(
            (collectionItems) => collectionItems.id === value
          );
          if (index > -1) {
            collectionItems.splice(index, 1);
            setCollectionItems([...collectionItems]);
          }
        }
      }
    );
  };

  const checkImage = (item) => {
    if (!item.image.path.includes("http")) {
      return require("../../public/images/" +
        item.image.path)
    }
    else {
      return item.image.path
    }
  }

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const actions = [
    {
      icon: EditIcon,
      tooltip: intl.formatMessage({ id: "app.button.edit" }),
      onClick: (event, rowData) => alert("You saved " + rowData.name),
    },
    (rowData) => ({
      icon: DeleteIcon,
      tooltip: intl.formatMessage({ id: "app.button.delete" }),
      onClick: (event, rowData) => {
        console.log(rowData.id);
        setValue(rowData.id);
        setConfirmOpen(true);
      },
    }),
  ];

  const options = {
    sorting: true,
    exportButton: true,
    headerStyle: { fontWeight: "bold" },
    actionsColumnIndex: -1,
  };

  const columns = [
    {
      title: intl.formatMessage({ id: "app.feed.add_feed_name" }),
      field: "id",
      hidden: true,
    },
    {
      title: intl.formatMessage({
        id: "app.collection.view_collections_item_name",
      }),
      field: "name",
    },
    {
      title: intl.formatMessage({
        id: "app.collection.view_collections_item_serie",
      }),
      field: "serie",
    },
    {
      title: intl.formatMessage({
        id: "app.collection.view_collections_item_price",
      }),
      field: "price",
    },
    {
      title: intl.formatMessage({
        id: "app.collection.view_collections_item_year",
      }),
      field: "year",
    },
    {
      title: intl.formatMessage({
        id: "app.collection.view_collections_item_own",
      }),
      field: "own",
    },
    {
      title: intl.formatMessage({
        id: "app.collection.view_collections_item_image",
      }),
      field: "image",
    },
    {
      title: intl.formatMessage({
        id: "app.collection.view_collections_item_notes",
      }),
      field: "notes",
    },
  ];

  const cardStyleHover = {
    cursor: "pointer",
    height: 400,
    minWidth: 250,
    maxWidth: 250,
    boxShadow: 15,
  };

  const data = collectionItems.map((item) => {
    let rows = {
      id: item.id,
      name: item.name,
      serie: item.serie.name,
      price: (
        <FormattedNumber
          value={item.price}
          style="currency"
          currency={currency.currency}
        />
      ),
      year: item.year,
      own: (
        <Tooltip
          title={intl.formatMessage({
            id: "app.tooltip.click_own",
          })}
          placement="right"
          arrow
        >
          <Button
            id={item.id}
            onClick={(e) => {
              handleOwnClick(e, item.own);
            }}
            className="button-own"
            startIcon={
              <Avatar
                variant="square"
                sx={{ width: 35, height: 35, ml: 2 }}
                src={item.own ? Tick : Cross}
              />
            }
          ></Button>
        </Tooltip>
      ),
      image: (
        <Tooltip
          title={intl.formatMessage({
            id: "app.tooltip.click_image",
          })}
          arrow
          followCursor
        >
          <IconButton
            onClick={() => {
              setImageClicked(item);
              handleOpen();
            }}
            size="small"
            sx={{ ml: 1 }}
            aria-controls={props.openAnch ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={props.openAnch ? "true" : undefined}
            color="inherit"
          >
            {item.image != null ? (
              <Avatar
                variant="rounded"
                src={checkImage(item)}
                sx={{ width: 100, height: 35 }}
              />
            ) : (
              <Avatar
                variant="rounded"
                src={require("../images/no-photo-available.png")}
                sx={{ width: 100, height: 35 }}
              />
            )}
          </IconButton>
        </Tooltip>
      ),
      notes: item.notes,
    };
    return rows;
  });

  return (
    <Box sx={{ display: "flex" }}>
      <Grid container>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          <Grid item xs={3} mt={"115px"}>
            <Tooltip
              title={intl.formatMessage({
                id: "app.tooltip.add_new_item",
              })}
              placement="top"
              arrow
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setOpenNew(true);
                }}
              /*onClick={() => navigate("/collections/add")}*/
              >
                {/*</Button><Button
                variant="contained"
                color="secondary"
                onClick={() =>
                  navigate("/collections/add-item", {
                    state: { id: collectionId, name: location.state.name },
                  })
                }
              >*/}
                <AddIcon></AddIcon>
              </Button>
            </Tooltip>
            <Tooltip
              title={intl.formatMessage({
                id: "app.tooltip.grid_view",
              })}
              placement="top"
              arrow
            >
              <Button
                variant="contained"
                color="success"
                onClick={() => setToggleView("grid")}
              >
                <GridViewIcon></GridViewIcon>
              </Button>
            </Tooltip>
            <Tooltip
              title={intl.formatMessage({
                id: "app.tooltip.list_view",
              })}
              placement="top"
              arrow
            >
              <Button
                variant="contained"
                color="success"
                onClick={() => setToggleView("list")}
              >
                <ViewListIcon></ViewListIcon>
              </Button>
            </Tooltip>
          </Grid>
          <Grid item xs={4}>
            {location.state.logo ? (
              LogoDisplay(location.state.logo.path)
            ) : (
              <Typography variant="h4" component="h4">
                {location.state.name}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <BorderLinearProgressBar
            variant="determinate"
            value={
              +Number.parseFloat((collected / totalItems) * 100).toFixed(2)
            }
          ></BorderLinearProgressBar>
        </Grid>
        <Grid container>
          <Grid item xs={3}>
            <Typography variant="h5" component="div">
              <FormattedMessage id="app.collection.collected"></FormattedMessage>{" "}
              {collected + " / " + totalItems}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h5" component="div">
              <FormattedMessage id="app.collection.wanted"></FormattedMessage>{" "}
              {wished}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h5" component="div">
              <FormattedMessage id="app.collection.missing"></FormattedMessage>{" "}
              {totalItems - collected}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h5" component="div">
              <FormattedMessage id="app.collection.invested"></FormattedMessage>{" "}
              {
                <FormattedNumber
                  value={moneySpent}
                  style="currency"
                  currency={currency.currency}
                />
              }
            </Typography>
          </Grid>
          {toggleView === "list" && (
            <Grid container pt={3}>
              <Grid item xs={12}>
                <MaterialTable
                  title={
                    <FormattedMessage id="app.collection.view_collections_items"></FormattedMessage>
                  }
                  data={data}
                  columns={columns}
                  options={options}
                  actions={actions}
                />
              </Grid>
            </Grid>
          )}
          {toggleView === "grid" && (
            <Grid container spacing={5} className="container" pt={3}>
              {collectionItems !== undefined
                ? collectionItems.map((item) => (
                  <Grid item key={item.id} >
                    <Card
                      sx={
                        cardHover === item ? cardStyleHover :
                          {
                            height: 400,
                            minWidth: 250,
                            maxWidth: 250,
                            boxShadow: 3,
                          }
                      }
                      ml={200}
                      onMouseOver={() => {
                        setCardHover(item)
                      }}
                      onMouseOut={() => {
                        setCardHover(null)
                      }}
                    >
                      <Box ml={23.1} mb={-10}>
                        <Tooltip
                          title={intl.formatMessage({
                            id: "app.tooltip.click_wish",
                          })}
                          placement="right"
                          arrow
                        >
                          <IconButton
                            id={item.id}
                            color="primary"
                            sx={{
                              position: "relative",
                              height: 25,
                              width: 25,
                              ml: -23.5,
                              mb: 6,
                            }}
                            onClick={(e) => {
                              handleWishClick(e, item.own, item.wanted);
                            }}
                            className="button-wish"
                          >
                            {item.wanted ? (
                              <BookmarkIcon fontSize="large"></BookmarkIcon>
                            ) : (
                              <BookmarkBorderIcon fontSize="large"></BookmarkBorderIcon>
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={intl.formatMessage({
                            id: "app.tooltip.click_own",
                          })}
                          placement="right"
                          arrow
                        >
                          <Button
                            id={item.id}
                            sx={{
                              position: "relative",
                              height: 75,
                              width: 75,
                              ml: 19.153,
                              mt: -0.5,
                            }}
                            onClick={(e) => {
                              handleOwnClick(e, item.own, item.wanted);
                            }}
                            className="button-own"
                            startIcon={
                              <Avatar
                                variant="square"
                                sx={{ width: 75, height: 75, ml: 1, mt: 1 }}
                                src={item.own ? OwnImage : NotOwnImage}
                              />
                            }
                          >
                            <Typography
                              className="own-text"
                              sx={{ position: "absolute", ml: 2.5 }}
                            >
                              {item.own ? (
                                <FormattedMessage id="app.button.own"></FormattedMessage>
                              ) : (
                                <FormattedMessage id="app.button.not_own"></FormattedMessage>
                              )}
                            </Typography>
                          </Button>
                        </Tooltip>
                      </Box>
                      <CardContent>
                        {item.logo ? null : (
                          <Typography
                            align="center"
                            sx={{ fontSize: 20 }}
                            color="text.primary"
                            gutterBottom
                          ></Typography>
                        )}
                        {item.image != null && (
                          <Tooltip
                            title={intl.formatMessage({
                              id: "app.tooltip.click_image",
                            })}
                            arrow
                            followCursor
                          >
                            {item.image != null &&
                              (<CardMedia
                                component="img"
                                width="500%"
                                height="220"
                                image={checkImage(item)}
                                alt={item.name}
                                className="card-collection"
                                value={item.image.path}
                                onClick={() => {
                                  setImageClicked(item);
                                  handleOpen();
                                }}
                                style={styles}
                              />)}
                          </Tooltip>
                        )}
                        <Typography
                          align="center"
                          sx={{ mb: 0.5 }}
                          mt={1}
                          color="text.secondary"
                        >
                          {item.image === null && (
                            <CardMedia
                              component="img"
                              width="100%"
                              image={require("../images/no-photo-available.png")}
                              alt={item.name}
                              style={styles}
                            />
                          )}
                          {item.name}
                        </Typography>
                        <Typography
                          align="center"
                          color="text.secondary"
                        >
                          {item.year}
                        </Typography>
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
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() =>
                            navigate("/collections/edit-item", {
                              state: {
                                id: collectionId,
                                item: item,
                                name: location.state.name,
                              },
                            })
                          }
                        >
                          <FormattedMessage id="app.button.edit"></FormattedMessage>
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
                : null}
            </Grid>
          )}
        </Grid>
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
        {open && (
          <Dialog
            open={open}
            onClose={handleClose}
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          >
            <LazyLoadImage
              alt=""
              height={350}
              src={
                imageClicked !== ""
                  ? require("../../public/images/" + imageClicked)
                  : null
              }
              width="100%"
            />
          </Dialog>
        )}
        <SimpleDialog open={openNew} onClose={handleCloseNewCol} />
      </Grid>
    </Box >
  );
}

export default DisplayCollection;
