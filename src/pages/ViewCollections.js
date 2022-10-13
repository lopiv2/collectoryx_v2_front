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
                      image={require("../../public/images/" + item.logo.path)}
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
                <CardActions style={{ justifyContent: "center" }}>
                  <NavLink
                    to={{ pathname: `/collections/${item.name}` }}
                    state={{ id: item.id, logo: item.logo, name: item.name }}
                    style={{ textDecoration: "none" }}
                  >
                    <Button variant="contained">
                      <FormattedMessage id="app.button.open_collection"></FormattedMessage>
                    </Button>
                  </NavLink>
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
