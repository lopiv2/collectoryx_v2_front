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
  IconButton,
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import ConfigService from "../app/api/config.api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "../styles/Dashboard.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { AppContext } from "../components/AppContext";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { format } from "date-fns";
import { SetLocaleDateTime } from "../utils/generic";
import EditImageDialog from "../components/EditImageDialog";
import ConfirmDialog from "../components/ConfirmDialog";

function ManageImages(props) {
  const [cardHover, setCardHover] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [newImageEdited, setNewImageEdited] = useState();
  const navigate = useNavigate();
  const breadcrumbs = useBreadcrumbs();
  const intl = useIntl();
  const [cascade, setCascade] = useState(false);
  const { userData, setUserData } = React.useContext(AppContext);
  const [imageClicked, setImageClicked] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rowsOrder, setRowsOrder] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [orderDirection, setOrderDirection] = useState("up");
  const [images, setImages] = useState([]);
  const [imageSelected, setImageSelected] = useState();
  const [isLoading, setLoading] = useState(true);
  const loc = SetLocaleDateTime();
  const [confirmOpen, setConfirmOpen] = useState(false);

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
    //if (isLoading !== false) {
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
      setImages([]);
      filteredResponse.map((i) => setImages((images) => [...images, i]));
      setLoading(false);
    });
    //}
  };

  const avatarStyleClicked = {
    border: "2px solid green",
    width: 200,
    height: 200,
    boxShadow: 10,
  };

  const avatarStyleHover = {
    cursor: "pointer",
    width: 200,
    height: 200,
    boxShadow: 10,
  };

  const cardStyleHover = {
    cursor: "pointer",
    height: 200,
    minWidth: 200,
    maxWidth: 200,
    boxShadow: 15,
  };

  const handleDeleteClick = () => {
    ConfigService.deleteImage(imageSelected, cascade).then((response) => {
      if (response.data === true) {
        toast.success(
          <FormattedMessage id="app.collection.item-deleted"></FormattedMessage>,
          { theme: "colored" }
        );
        var index = images.findIndex(
          (images) => images.id === imageSelected.id
        );
        if (index > -1) {
          images.splice(index, 1);
          setImages([...images]);
          setImageSelected(undefined);
          fetchData(page, rowsPerPage, "name");
          setLoading(false);
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
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          pt={2}
        >
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
              onChange={(e) => {
                if (e.target.value.trim().length === 0) {
                  setSearchQuery("");
                  fetchData(page, rowsPerPage, "name");
                } else {
                  setSearchQuery(e.target.value);
                  fetchData(page, rowsPerPage, rowsOrder, searchQuery);

                  //searchQueryInApi(searchQuery);
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
        <Grid container pt={2}>
          <Grid item xs={10}>
            <Grid item xs={12}>
              <Grid
                container
                maxWidth="auto"
                width="auto"
                className="container"
                sx={{ border: "2px solid grey", minWidth: 200 }}
              >
                {isLoading === false && images.length > 0 ? (
                  <Grid
                    container
                    spacing={{ xs: 2, sm: 2, md: 8, lg: 6, xl: 8 }}
                    columns={{ xs: 3, sm: 5, md: 8, lg: 10, xl: 12 }}
                    pt={2}
                    pb={2}
                    pl={2}
                  >
                    {images.map((i) => (
                      <Grid item xs={2.4} key={i.id} pl={1}>
                        <Card
                          sx={
                            cardHover === i.id
                              ? cardStyleHover
                              : {
                                  height: 200,
                                  minWidth: 200,
                                  maxWidth: 200,
                                  boxShadow: 3,
                                }
                          }
                          onMouseOver={() => {
                            setCardHover(i.id);
                          }}
                          onMouseOut={() => {
                            setCardHover(null);
                          }}
                        >
                          <Tooltip title={i.name} followCursor arrow>
                            <Avatar
                              key={i.id}
                              variant="rounded"
                              imgProps={{ referrerPolicy: "no-referrer" }}
                              sx={
                                imageClicked === i.id
                                  ? avatarStyleClicked
                                  : avatarStyleHover
                              }
                              src={"/images/uploads/" + i.path} // use normal <img> attributes as props
                              width="100%"
                              onClick={(e) => {
                                setImageClicked(i.id);
                                setImageSelected(i);
                              }}
                            />
                          </Tooltip>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="10vh"
              maxWidth="lg"
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
          <Grid item xs={2}>
            <Grid item xs={12}>
              {imageSelected !== undefined && (
                <Grid
                  container
                  maxWidth="lg"
                  className="container"
                  style={{ border: "2px solid grey" }}
                >
                  <Grid item xs={2.4} height={"auto"}>
                    <Card
                      sx={{
                        minWidth: 265,
                        maxWidth: 265,
                        boxShadow: 3,
                      }}
                    >
                      <Avatar
                        imgProps={{ referrerPolicy: "no-referrer" }}
                        variant="rounded"
                        src={"/images/uploads/" + imageSelected.path} // use normal <img> attributes as props
                        sx={{
                          marginLeft: 7,
                          height: 150,
                          minWidth: 150,
                          maxWidth: 150,
                        }}
                      />
                      <Typography
                        align="left"
                        mt={1}
                        ml={1}
                        color="text.primary"
                        variant="body1"
                      >
                        {imageSelected.path}
                      </Typography>
                      <Typography
                        align="left"
                        sx={{ mb: 0.5, ml: 1 }}
                        color="#8F8F8F"
                        variant="body2"
                      >
                        {format(new Date(imageSelected.created), "P", {
                          locale: loc,
                        })}
                      </Typography>
                      <Typography
                        align="left"
                        sx={{ mb: 0.5, ml: 1 }}
                        color="#8F8F8F"
                        variant="body2"
                      >
                        {imageSelected.dimensions}
                      </Typography>
                      <Typography
                        align="left"
                        sx={{ mb: 0.5, ml: 1 }}
                        color="#8F8F8F"
                        variant="body2"
                      >
                        {imageSelected.size}
                      </Typography>
                      <Tooltip
                        title={intl.formatMessage({
                          id: "app.button.edit",
                        })}
                        followCursor
                        arrow
                      >
                        <IconButton
                          color="primary"
                          fontSize="large"
                          sx={{
                            position: "relative",
                            height: 55,
                            width: 55,
                            mb: 6,
                          }}
                          onClick={() => {
                            setOpenEdit(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={intl.formatMessage({
                          id: "app.button.delete",
                        })}
                        followCursor
                        arrow
                      >
                        <IconButton
                          color="primary"
                          fontSize="large"
                          sx={{
                            position: "relative",
                            height: 55,
                            width: 55,
                            mb: 6,
                          }}
                          onClick={() => {
                            setConfirmOpen(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <ConfirmDialog
                        title={intl.formatMessage({
                          id: "app.dialog.delete_title",
                        })}
                        open={confirmOpen}
                        setOpen={setConfirmOpen}
                        onConfirm={handleDeleteClick}
                        showCascade={false}
                        setCascade={setCascade}
                      >
                        <FormattedMessage id="app.dialog.confirm_delete"></FormattedMessage>
                      </ConfirmDialog>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <EditImageDialog
        items={imageSelected}
        setItem={setImageSelected}
        newItem={newImageEdited}
        setNewItem={setNewImageEdited}
        open={openEdit}
        setOpen={setOpenEdit}
      >
        <FormattedMessage id="app.dialog.confirm_delete"></FormattedMessage>
      </EditImageDialog>
    </Box>
  );
}

export default ManageImages;
