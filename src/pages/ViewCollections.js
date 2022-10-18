import React, { useState, useEffect, useRef } from "react";
import {
  Pagination,
  TextField,
  MenuItem,
  Typography,
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  IconButton,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { FormattedMessage, useIntl } from "react-intl";
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import { ToastContainer } from "react-toastify";
//import { useNavigate } from "react-router-dom";
import styles from "../styles/Collections.css";
import BorderLinearProgressBar from "../components/BorderLinearProgressBar";
import { NavLink } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { AppContext } from "../components/AppContext";
import AddIcon from "@mui/icons-material/Add";
import ConfirmDialog from "../components/ConfirmDialog";
import { toast } from "react-toastify";
import { FeatureForImplement } from "../utils/generic";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function ViewCollection(props) {
  const [collectionsList, setCollectionsList] = useState([]);
  const intl = useIntl();
  //const navigate = useNavigate();
  const [cardHover, setCardHover] = useState(null);
  const breadcrumbs = useBreadcrumbs();
  const { userData, setUserData } = React.useContext(AppContext);
  let isMounted = useRef(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rowsOrder, setRowsOrder] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [orderDirection, setOrderDirection] = useState("down");
  const [openNew, setOpenNew] = useState(false);
  const [value, setValue] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cascade, setCascade] = useState(false);

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

  const searchQueryInApi = () => {
    if (searchQuery.length > 0) {
      fetchData(page, rowsPerPage, rowsOrder, searchQuery);
    } else {
      setRowsOrder("name");
      setPage(0);
      fetchData(page, rowsPerPage, "name");
    }
  };

  const handleAmbitClick = (event, ambit) => {
    ConfigService.toggleCollectionAmbit(
      event.currentTarget.id,
      ambit
    ).then((response) => {
      var index = collectionsList.findIndex(
        (collectionsList) => collectionsList.id === response.data.id
      );
      let newItems = [...collectionsList];
      newItems[index].ambit = response.data.ambit;
      setCollectionsList(newItems);
    });
  };

  const fetchData = async (page, rowsPerPage, orderField, search) => {
    const query = {
      id: userData.id,
      page: page,
      size: rowsPerPage,
      search: search,
      orderField: orderField,
      orderDirection: orderDirection,
    };
    ConfigService.getCollectionLists(query)
      .then((response) => {
        if (isMounted) {
          setTotalPages(response.data.totalPages);
          setCollectionsList(response.data.content);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      isMounted = false;
    };
  };

  useEffect(() => {
    fetchData(page, rowsPerPage, "name");
    setOrderDirection("down");
  }, []);

  const cardStyleHover = {
    cursor: "pointer",
    height: 400,
    minWidth: 250,
    maxWidth: 250,
    boxShadow: 15,
  };

  const handleDeleteClick = () => {
    ConfigService.deleteCollection(value, cascade).then(
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
    <Box>
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
          <Typography display="inline" variant="h4" component="h4">
            <FormattedMessage id="app.collection.view_collections_title"></FormattedMessage>
          </Typography>
          {/*userData.license.includes("Free") && (
            <Typography display="inline" variant="h4" component="h4">
              {" (" + collectionsList.length + "/3)"}
            </Typography>
          )*/}
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
                onClick={() => {
                  setOpenNew(true);
                }}
              /*onClick={() => navigate("/collections/add")}*/
              >
                <AddIcon></AddIcon>
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={4} pt={1}>
            <Typography variant="h6" display="inline" component="div">
              <FormattedMessage id="app.license.show_code"></FormattedMessage>:
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
          <Grid item xs={4} pt={1}>
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
              <MenuItem value="totalItems">
                <FormattedMessage id="app.total_items"></FormattedMessage>
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
          <Grid item xs={4} pt={1}>
            <TextField
              id="search-bar"
              className="text"
              value={searchQuery}
              onInput={(e) => {
                setSearchQuery(e.target.value);
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
        <Grid container spacing={5} className="container" pt={3}>
          {collectionsList.map((item, index) => (
            <Grid item key={item.id}>
              <Card
                sx={
                  cardHover === item
                    ? cardStyleHover
                    : {
                      height: 400,
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
                      id: "app.tooltip.click_public",
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
                        ml: -22.5,
                        mb: 6,
                      }}
                      onClick={(e) => {
                        handleAmbitClick(e, item.ambit);
                      }}
                      className="button-wish"
                    >
                      {item.ambit ? (
                        <VisibilityIcon
                          color="success"
                          fontSize="large"
                        ></VisibilityIcon>
                      ) : (
                        <VisibilityOffIcon
                          htmlColor="red"
                          fontSize="large"
                        ></VisibilityOffIcon>
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
                <NavLink
                  to={{ pathname: `/collections/${item.name}` }}
                  state={{ id: item.id, logo: item.logo, name: item.name }}
                  style={{ textDecoration: "none" }}
                >
                  <Tooltip
                    title={intl.formatMessage({
                      id: "app.tooltip.click_open",
                    })}
                    followCursor
                    arrow
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
                          image={"/images/uploads/" + item.logo.path}
                          alt={item.name}
                          className="card-collection-no-pointer"
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
                        {item.owned + "/" + item.totalItems}
                      </Typography>
                      <BorderLinearProgressBar
                        variant="determinate"
                        value={
                          item.totalItems !== 0 && item.owned !== 0
                            ? (item.owned / item.totalItems) * 100
                            : 0
                        }
                      ></BorderLinearProgressBar>
                    </CardContent>
                  </Tooltip>
                </NavLink>
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
                    onClick={() => FeatureForImplement()}
                  >
                    <FormattedMessage id="app.button.export_module"></FormattedMessage>
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
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
      </Grid>
    </Box>
  );
}

export default ViewCollection;
