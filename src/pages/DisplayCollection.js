import React, { useState, useEffect, useRef } from "react";
import { Pagination } from "@mui/material";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";
import {
  Avatar,
  Typography,
  Tooltip,
  RadioGroup,
  Radio,
  FormControlLabel,
  List,
  ListItem,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Paper,
  Divider,
  Button,
  MenuItem,
  TextField,
  Grid,
  Box,
  DialogTitle,
} from "@mui/material";
import NoImage from "../images/no-photo-available.png";
import PropTypes from "prop-types";
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import OwnImage from "../images/Own.png";
import NotOwnImage from "../images/NotOwn.png";
import Tick from "../images/Tick.png";
import Cross from "../images/Cross.png";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Collections.css";
import BorderLinearProgressBar from "../components/BorderLinearProgressBar";
import { useLocation } from "react-router-dom";
import LogoDisplay from "../components/LogoDisplay";
import {
  GetCurrencySymbolLocale,
  CurrencyChecker,
  SetLocaleDateTime,
} from "../utils/generic";
import Dialog from "@material-ui/core/Dialog";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ConfirmDialog from "../components/ConfirmDialog";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import SearchIcon from "@mui/icons-material/Search";
import MaterialTable from "@material-table/core";
import IconButton from "@mui/material/IconButton";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

function DisplayCollection(props) {
  const [collectionItems, setCollectionItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [collected, setCollected] = useState(0);
  const [wished, setWished] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [moneySpent, setMoneySpent] = useState(0);
  const currency = CurrencyChecker();
  const [open, setOpen] = useState(false);
  const currencySymbol = GetCurrencySymbolLocale();
  const loc = SetLocaleDateTime();
  const [openNew, setOpenNew] = useState(false);
  const intl = useIntl();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [imageClicked, setImageClicked] = useState(null);
  const [cardHover, setCardHover] = useState(null);
  const [toggleView, setToggleView] = useState("grid");
  const breadcrumbs = useBreadcrumbs();
  const [collectionId, setCollectionId] = useState();
  const [itemSelected, setItemSelected] = useState(null);
  let isMounted = useRef(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rowsOrder, setRowsOrder] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderDirection, setOrderDirection] = useState("down");

  const toggleOrderDirection = () => {
    if (orderDirection.includes("down")) {
      setOrderDirection("up");
    } else {
      setOrderDirection("down");
    }
  };

  useEffect(() => {
    setPage(0);
    fetchData(0, rowsPerPage, rowsOrder, searchQuery);
  }, [orderDirection]);

  const handleChangeOrderDirection = () => {
    toggleOrderDirection();
  };

  const handleChange = (e, p) => {
    setPage(p);
    fetchData(p - 1, rowsPerPage, rowsOrder, searchQuery);
  };

  const handleChangeShowItems = (event) => {
    setRowsPerPage(event);
    setPage(0);
    fetchData(0, event, rowsOrder, searchQuery);
  };

  const handleChangeRowOrder = (event) => {
    setRowsOrder(event);
    setPage(0);
    fetchData(0, rowsPerPage, event, searchQuery);
  };

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
        });
      }
      if (templateSelected === "file") {
        navigate("/collections/import-scrapper", {
          state: { id: collectionId, name: location.state.name },
        });
      }
    };

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
            {/*<Grid item ml={2}>
              <FormControlLabel
                value="shop"
                control={<Radio />}
                label={intl.formatMessage({
                  id: "app.collection.add_collection_import_shop",
                })}
              />
              </Grid>*/}
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

  const getOwnedItems = () => {
    ConfigService.getCollectionById(location.state.id).then((response) => {
      setMoneySpent(response.data.totalPrice);
      setCollected(response.data.owned);
      setTotalItems(response.data.totalItems);
      setWished(response.data.wanted);
    });
  };

  const fetchData = async (page, rowsPerPage, orderField, search) => {
    const query = {
      id: location.state.id,
      page: page,
      size: rowsPerPage,
      search: search,
      orderField: orderField,
      orderDirection: orderDirection,
    };
    ConfigService.getCollectionItemsById(query)
      .then((response) => {
        if (isMounted) {
          setTotalPages(response.data.totalPages);
          setCollectionItems(response.data.content);
          setCollectionId(location.state.id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      isMounted = false;
    };
  };

  const searchQueryInApi = () => {
    if (searchQuery.length > 0) {
      fetchData(page, rowsPerPage, rowsOrder, searchQuery);
    } else {
      setRowsOrder("name");
      setPage(0);
      fetchData(page, rowsPerPage, "name");
    }
  };

  useEffect(() => {
    if (toggleView === "grid") {
      fetchData(page, rowsPerPage, "name");
      setOrderDirection("down");
      getOwnedItems();
    }
  }, [toggleView]);

  const handleWishClick = (event, own, wanted) => {
    ConfigService.toggleItemWish(event.currentTarget.id, own, wanted).then(
      (response) => {
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
      }
    );
  };

  const handleOwnClick = (event, own, wanted) => {
    ConfigService.toggleItemOwn(event.currentTarget.id, own, wanted).then(
      (response) => {
        var index = collectionItems.findIndex(
          (collectionItems) => collectionItems.id === response.data.id
        );
        let newItems = [...collectionItems];
        newItems[index].own = response.data.own;
        newItems[index].acquiringDate = response.data.acquiringDate;
        if (response.data.own) {
          setMoneySpent(moneySpent + response.data.price);
          setCollected(collected + 1);
        } else {
          setMoneySpent(moneySpent - response.data.price);
          setCollected(collected - 1);
        }
        setCollectionItems(newItems);
      }
    );
  };

  const handleDeleteClick = () => {
    ConfigService.deleteCollectionItem(value).then((response) => {
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
    });
  };

  const checkImage = (item) => {
    if (item.image) {
      if (item.image.path) {
        if (!item.image.path.includes("http")) {
          return "/images/uploads/" + item.image.path;
        } else {
          return item.image.path;
        }
      }
    }
    return NoImage;
  };

  const checkImageSerie = (item) => {
    //console.log(item);
    if (item.logo) {
      if (!item.logo.path.includes("http")) {
        return "/images/uploads/" + item.logo.path;
      } else {
        return item.logo.path;
      }
    }
    return NoImage;
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setItemSelected(null);
  };

  const editRoute = () => {
    navigate("/collections/edit-item", {
      state: {
        id: collectionId,
        item: itemSelected,
        name: location.state.name,
      },
    });
  };

  useEffect(() => {
    if (itemSelected !== null && open === false) {
      editRoute();
    }
  }, [itemSelected, open]);

  const actions = [
    {
      icon: EditIcon,
      tooltip: intl.formatMessage({ id: "app.button.edit" }),
      onClick: (event, rowData) => {
        const it = collectionItems.find((item) => item.id === rowData.id);
        setItemSelected(it);
      },
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
        id: "app.collection.view_collections_item_wanted",
      }),
      field: "wanted",
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
    height: 380,
    minWidth: 250,
    maxWidth: 250,
    boxShadow: 15,
  };

  const data = collectionItems.map((item) => {
    let rows = {
      id: item.id,
      name: item.name,
      serie: item.serie ? item.serie.name : null,
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
      wanted: (
        <Tooltip
          title={intl.formatMessage({
            id: "app.tooltip.click_wish",
          })}
          placement="right"
          arrow
        >
          <Button
            id={item.id}
            onClick={(e) => {
              handleWishClick(e, item.own, item.wanted);
            }}
            className="button-own"
            startIcon={
              <Avatar
                variant="square"
                sx={{ width: 35, height: 35, ml: 2 }}
                src={item.wanted ? Tick : Cross}
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
              setItemSelected(item);
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
                src={NoImage}
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
          spacing={{ xs: 2, md: 5 }}
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
                onClick={() => {
                  fetchData(null, null, "name");
                  setToggleView("list");
                }}
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
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 3, sm: 8, md: 12 }}
        >
          <Grid item xs={3} sm={3} md={3}>
            <Typography variant="h5" component="div">
              <FormattedMessage id="app.collection.collected"></FormattedMessage>{" "}
              {collected + " / " + totalItems}
            </Typography>
          </Grid>
          <Grid item xs={3} sm={3} md={3}>
            <Typography variant="h5" component="div">
              <FormattedMessage id="app.collection.wanted"></FormattedMessage>{" "}
              {wished}
            </Typography>
          </Grid>
          <Grid item xs={3} sm={3} md={3}>
            <Typography variant="h5" component="div">
              <FormattedMessage id="app.collection.missing"></FormattedMessage>{" "}
              {totalItems - collected}
            </Typography>
          </Grid>
          <Grid item xs={3} sm={3} md={3}>
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
          {toggleView === "grid" && (
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
              pt={2}
              pl={3}
            >
              <Grid item xs={3} sm={3} md={3} pt={1}>
                <Typography variant="h6" display="inline" component="div">
                  <FormattedMessage id="app.license.show_code"></FormattedMessage>
                  :
                </Typography>
                <TextField
                  id="items-show"
                  name="items-show"
                  select
                  size="small"
                  sx={{ minWidth: 100 }}
                  value={rowsPerPage}
                  onChange={(event) => {
                    handleChangeShowItems(event.target.value);
                  }}
                >
                  <MenuItem value="5">5</MenuItem>
                  <MenuItem value="10">10</MenuItem>
                  <MenuItem value="20">20</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={3} sm={3} md={3} pt={1}>
                <Typography variant="h6" display="inline" component="div">
                  <FormattedMessage id="app.collection.view_collections_order_by"></FormattedMessage>
                </Typography>
                <TextField
                  id="items-show"
                  name="items-show"
                  select
                  size="small"
                  sx={{ minWidth: 100 }}
                  value={rowsOrder}
                  onChange={(event) => {
                    handleChangeRowOrder(event.target.value);
                  }}
                >
                  <MenuItem value="name">
                    <FormattedMessage id="app.collection.view_collections_item_name"></FormattedMessage>
                  </MenuItem>
                  <MenuItem value="serie">
                    <FormattedMessage id="app.collection.view_collections_item_serie"></FormattedMessage>
                  </MenuItem>
                  <MenuItem value="own">
                    <FormattedMessage id="app.collection.view_collections_item_own"></FormattedMessage>
                  </MenuItem>
                  <MenuItem value="wanted">
                    <FormattedMessage id="app.collection.view_collections_item_wanted"></FormattedMessage>
                  </MenuItem>
                  <MenuItem value="year">
                    <FormattedMessage id="app.collection.view_collections_item_year"></FormattedMessage>
                  </MenuItem>
                </TextField>
                <Tooltip
                  title={intl.formatMessage({
                    id: orderDirection.includes("up")
                      ? "app.tooltip.sort_order_asc"
                      : "app.tooltip.sort_order_desc",
                  })}
                  arrow
                  followCursor
                >
                  <IconButton
                    type="submit"
                    aria-label="search"
                    onClick={() => {
                      handleChangeOrderDirection();
                    }}
                  >
                    {orderDirection.includes("up") ? (
                      <ArrowUpwardIcon />
                    ) : (
                      <ArrowDownwardIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={3} sm={3} md={3} pt={1}>
                <TextField
                  id="search-bar"
                  className="text"
                  value={searchQuery}
                  onChange={(e) => {
                    if (e.target.value.trim().length === 0) {
                      setSearchQuery("");
                      fetchData(page, rowsPerPage, "name");
                    } else {
                      setSearchQuery(e.target.value);
                      fetchData(page, rowsPerPage, rowsOrder, searchQuery);
                    }
                  }}
                  onKeyPress={(e) => {
                    searchQueryInApi(searchQuery);
                    if (e.key === "Enter") {
                      searchQueryInApi(searchQuery);
                    }
                  }}
                  variant="outlined"
                  placeholder={intl.formatMessage({
                    id: "app.button.search",
                  })}
                  size="small"
                />
                <IconButton
                  type="submit"
                  aria-label="search"
                  onClick={(e) => {
                    searchQueryInApi(searchQuery);
                  }}
                >
                  <SearchIcon style={{ fill: "blue" }} />
                </IconButton>
              </Grid>
            </Grid>
          )}
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
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 3, sm: 8, md: 12 }}
              pt={2}
              pl={3}
            >
              {collectionItems !== undefined
                ? collectionItems.map((item) => (
                    <Grid item key={item.id}>
                      <Card
                        //Height auto while dynamic size of font cant be achieved in MUI
                        sx={
                          cardHover === item
                            ? cardStyleHover
                            : {
                                height: "auto",
                                minWidth: 250,
                                maxWidth: 250,
                                boxShadow: 3,
                              }
                        }
                        ml={200}
                        onMouseOver={() => {
                          setCardHover(item);
                        }}
                        onMouseOut={() => {
                          setCardHover(null);
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
                              style={{ color: "rgba(240, 216, 0, 1)" }}
                              sx={{
                                position: "relative",
                                height: 25,
                                width: 25,
                                ml: -22.5,
                                mb: 6,
                                mt: 1,
                              }}
                              onClick={(e) => {
                                handleWishClick(e, item.own, item.wanted);
                              }}
                              className="button-wish"
                            >
                              {item.wanted ? (
                                <StarIcon fontSize="large"></StarIcon>
                              ) : (
                                <StarBorderIcon fontSize="large"></StarBorderIcon>
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
                                ml: 18.153,
                                mt: -1.5,
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
                          <Tooltip
                            title={intl.formatMessage({
                              id: "app.tooltip.click_image",
                            })}
                            arrow
                            followCursor
                          >
                            <CardMedia
                              component="img"
                              width="500%"
                              height="220"
                              image={checkImage(item)}
                              alt={item.name}
                              className="card-collection"
                              onClick={() => {
                                setImageClicked(item);
                                setItemSelected(item);
                                handleOpen();
                              }}
                              style={styles}
                            />
                          </Tooltip>
                          <Typography
                            align="center"
                            sx={{ mb: 0.5 }}
                            mt={1}
                            color="text.primary"
                          >
                            {item.name}
                          </Typography>
                          <Typography align="center" color="text.secondary">
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
                            onClick={() => setItemSelected(item)}
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
            PaperProps={{
              sx: {
                width: "50%",
                maxHeight: 300,
              },
              style: {
                backgroundColor: "rgba(255, 255, 255)",
                boxShadow: "none",
              },
            }}
            open={open}
            onClose={handleClose}
            style={{ maxWidth: false, maxHeight: "100%", minHeight: "350px" }}
          >
            <Grid
              container
              spacing={{ xs: 2, md: 5 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
              style={{ backgroundColor: "rgba(245, 245, 245, 1)" }}
              width="100%"
            >
              <Grid
                container
                columns={{ xs: 4, sm: 8, md: 12 }}
                item
                xs={6}
                alignItems="center"
                justifyContent="center"
              >
                <Grid
                  item
                  ml={2}
                  mt={2}
                  mr={2}
                  mb={2}
                  component={Paper}
                  elevation={2}
                >
                  <LazyLoadImage
                    alt=""
                    height="auto"
                    effect="blur"
                    src={imageClicked !== "" ? checkImage(imageClicked) : null}
                    width="100%"
                  />
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={6} pb={2} >
                <Grid item pt={2} pb={2} sx={{ pl: { xs: 2 } }}>
                  <Avatar
                    component={Paper}
                    elevation={2}
                    variant="rounded"
                    sx={{ width: 65, height: 65 }}
                    src={
                      itemSelected !== null && itemSelected.serie !== null
                        ? checkImageSerie(itemSelected.serie)
                        : NoImage
                    }
                  />
                </Grid>
                <Grid item pt={4} pl={2}>
                  <Typography display="inline" variant="h6">
                    {itemSelected.name}
                  </Typography>
                </Grid>
                <Grid container sx={{ pl: { xs: 2 } }}>
                  <Paper
                    style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
                    xs={12}
                    width="100%"
                  >
                    <List component="nav" aria-label="fields">
                      <ListItem>
                        <Typography variant="body1">
                          <FormattedMessage id="app.collection.view_collections_item_serie"></FormattedMessage>
                          :{" "}
                          {itemSelected.serie != null
                            ? itemSelected.serie.name
                            : null}
                        </Typography>
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <Typography variant="body1">
                          <FormattedMessage id="app.collection.view_collections_item_collection"></FormattedMessage>
                          : {itemSelected.collection.name}
                        </Typography>
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <Typography variant="body1">
                          <FormattedMessage id="app.collection.view_collections_item_year"></FormattedMessage>
                          : {itemSelected.year}
                        </Typography>
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <Typography variant="body1">
                          <FormattedMessage id="app.collection.view_collections_item_price"></FormattedMessage>
                          : {itemSelected.price} {currencySymbol}
                        </Typography>
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <Typography variant="body1">
                          <FormattedMessage id="app.collection.view_collections_item_wanted"></FormattedMessage>
                          :
                        </Typography>
                        {
                          <Avatar
                            variant="square"
                            sx={{ width: 25, height: 25 }}
                            src={itemSelected.wanted ? Tick : Cross}
                          />
                        }
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <Typography variant="body1">
                          <FormattedMessage id="app.collection.view_collections_item_own"></FormattedMessage>
                          :
                        </Typography>
                        {
                          <Avatar
                            variant="square"
                            sx={{ width: 25, height: 25, ml: 2 }}
                            src={itemSelected.own ? Tick : Cross}
                          />
                        }
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <Typography variant="body1">
                          <FormattedMessage id="app.collection.view_collections_item_date"></FormattedMessage>
                          :{" "}
                          {itemSelected.own
                            ? format(
                                new Date(itemSelected.acquiringDate),
                                "P",
                                { locale: loc }
                              )
                            : ""}
                        </Typography>
                      </ListItem>
                      {itemSelected.metadata.length > 0 ? <Divider /> : null}
                      {itemSelected.metadata.map((item, index) => {
                        return (
                          <ListItem key={index}>
                            <Typography variant="body1" display="inline">
                              {item.name} : {item.value}
                            </Typography>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Dialog>
        )}
        <SimpleDialog open={openNew} onClose={handleCloseNewCol} />
        {toggleView === "grid" && (
          <Grid
            container
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="10vh"
          >
            <Pagination
              count={totalPages}
              color="primary"
              showFirstButton
              showLastButton
              page={page}
              variant="outlined"
              shape="rounded"
              onChange={handleChange}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default DisplayCollection;
