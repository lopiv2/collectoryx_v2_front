import React, { useState, useEffect } from "react";
import {
  Pagination,
  TextField,
  MenuItem,
  Typography,
  Box,
  Grid,
  Card,
  Avatar,
  Tooltip,
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import OptionsService from "../components/DropDownOptions";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { AppContext } from "../components/AppContext";
import NoImage from "../images/no-photo-available.png";
import { CircularProgress } from "@mui/material";

function ManageImages(props) {
  const [collectionsList, setCollectionsList] = useState([]);
  const [cardHover, setCardHover] = useState(null);
  const navigate = useNavigate();
  const breadcrumbs = useBreadcrumbs();
  const intl = useIntl();
  const [value, setValue] = useState(null);
  const [cascade, setCascade] = useState(false);
  const { userData, setUserData } = React.useContext(AppContext);
  const [imageClicked, setImageClicked] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [rowsOrder, setRowsOrder] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [orderDirection, setOrderDirection] = useState("down");
  const [images, setImages] = useState([]);
  const [imageSelected, setImageSelected] = useState();
  const [isLoading, setLoading] = useState(true);

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
    setLoading(true);
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
    if (isLoading !== false) {
      const query = {
        id: userData.id,
        page: page,
        size: rowsPerPage,
        search: search,
        orderField: orderField,
        orderDirection: orderDirection,
      };
      ConfigService.getLocalImages(query).then((response) => {
        setTotalPages(response.data.totalPages);
        var filteredResponse = [];
        filteredResponse = response.data.content.filter(
          (image) => !image.path.includes("http")
        );
        filteredResponse.map((i) => setImages((images) => [...images, i.path]));
        setLoading(false);
      });
    }
  };

  /*useEffect(() => {
    if (isLoading !== false) {
      const query = {
        id: userData.id,
        page: page,
        size: 12,
        search: "",
        orderField: "name",
        orderDirection: orderDirection,
      };
      ConfigService.getLocalImages(query).then((response) => {
        setLoading(false);
        var filteredResponse = [];
        filteredResponse = response.data.content.filter(
          (image) => !image.path.includes("http")
        );
        filteredResponse.map((i) => setImages((images) => [...images, i.path]));
        setTotalPages(response.data.totalPages);
      });
    }
  }, [isLoading, images]);*/

  /*useEffect(() => {
    fetchData(page, rowsPerPage, "name");
    setOrderDirection("down");
  }, []);*/

  const checkImage = (item) => {
    if (item.logo) {
      if (item.logo.path) {
        return "/images/uploads/" + item.logo.path;
      }
    }
    return NoImage;
  };

  const avatarStyleClicked = {
    border: "2px solid green",
    width: 200,
    height: 200,
    boxShadow: 10
  };

  const avatarStyleHover = {
    cursor: "pointer",
    width: 200,
    height: 200,
    boxShadow: 10
  };

  const cardStyleHover = {
    cursor: "pointer",
    height: 200,
    minWidth: 200,
    maxWidth: 200,
    boxShadow: 15,
  };

  const handleDeleteClick = () => {
    ConfigService.deleteCollection(value, cascade).then((response) => {
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
    });
  };

  return (
    <Box>
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
        <Grid item xs={6} pb={2}>
          <Typography variant="h4" component="h4">
            <FormattedMessage id="app.collection.manage_images_title"></FormattedMessage>
          </Typography>
        </Grid>
        <Grid container>
          <Grid item pt={1}>
            <Typography variant="body1">
              <FormattedMessage id="app.dialog.search_image"></FormattedMessage>
            </Typography>
          </Grid>
          <Grid item pb={1}>
            <TextField variant="outlined" size="small" onInput={(e) => {
              setSearchQuery(e.target.value);
            }}></TextField>
          </Grid>
        </Grid>
        <Box sx={{ display: "flex" }}>
          <Grid container style={{ border: "3px solid grey" }}>
            {isLoading === false && images.length > 0 ? (
              <Grid container spacing={1}>
                {images.map((i) => (
                  <Grid item xs={2} key={i} p={2}>
                    <Card sx={
                      cardHover === i
                        ? cardStyleHover
                        : {
                          height: 200,
                          minWidth: 200,
                          maxWidth: 200,
                          boxShadow: 3,
                        }
                    }
                      onMouseOver={() => {
                        setCardHover(i);
                      }}
                      onMouseOut={() => {
                        setCardHover(null);
                      }}
                    >
                      <Tooltip title={i} followCursor arrow>
                        <Avatar
                          key={i}
                          variant="rounded"
                          sx={
                            imageClicked === i
                              ? avatarStyleClicked
                              : avatarStyleHover
                          }
                          src={"/images/uploads/" + i} // use normal <img> attributes as props
                          width="100%"
                          onClick={(e) => {
                            setImageClicked(i);
                            setImageSelected(i);
                          }}
                        />
                      </Tooltip>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) :
              <Box>
                <CircularProgress disableShrink />
                <FormattedMessage id="app.images.loading"></FormattedMessage>
              </Box>}
          </Grid>
        </Box>
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

export default ManageImages;
