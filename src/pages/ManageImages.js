import React, { useState, useEffect } from "react";
import {
  Pagination,
  TextField,
  MenuItem,
  Typography,
  Box,
  Grid,
  Button,
  Avatar,
  Tooltip,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import OptionsService from "../components/DropDownOptions";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PropTypes from "prop-types";
import { AppContext } from "../components/AppContext";
import NoImage from "../images/no-photo-available.png";

function ManageImages(props) {
  const [collectionsList, setCollectionsList] = useState([]);
  const navigate = useNavigate();
  const breadcrumbs = useBreadcrumbs();
  const [open, setOpen] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const intl = useIntl();
  const [value, setValue] = useState(null);
  const [cascade, setCascade] = useState(false);
  const { userData, setUserData } = React.useContext(AppContext);
  const [imageClicked, setImageClicked] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rowsOrder, setRowsOrder] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [orderDirection, setOrderDirection] = useState("down");
  const [images, setImages] = useState([]);
  const [imageSelected, setImageSelected] = useState();

  function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;
    const [templateSelected, setTemplateSelected] = useState("new");

    const handleClose = () => {
      onClose(selectedValue);
    };

    const checkOptions = () => {
      if (templateSelected === "new") {
        navigate("/collections/add");
      }
      if (templateSelected === "file") {
        navigate("/collections/import-file");
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
                  id: "app.collection.add_collection_import",
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
              <Grid ml={3} mr={2}>
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

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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
    ConfigService.getCollectionLists(query).then((response) => {
      setTotalPages(response.data.totalPages);
      setCollectionsList(response.data.content);
    });
  };

  useEffect(() => {
    ConfigService.getLocalImages().then((response) => {
      var filteredResponse = [];
      filteredResponse = response.data.filter(
        (image) => !image.path.includes("http")
      );
      filteredResponse.map((i) => setImages((images) => [...images, i.path]));
      console.log(response.data)
    });
  }, []);

  useEffect(() => {
    fetchData(page, rowsPerPage, "name");
    setOrderDirection("down");
  }, []);

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
    width: 80,
    height: 80,
  };

  const avatarStyleHover = {
    cursor: "pointer",
    width: 80,
    height: 80,
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

  const getTemplateLabel = (template) => {
    var tempArray = [];
    tempArray = OptionsService.createCollectionOptions.find(
      (f) => f.value === template
    );
    if (tempArray !== undefined) {
      return tempArray.label.props.id;
    }
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
        <Grid item xs={6}>
          <Typography variant="h4" component="h4">
            <FormattedMessage id="app.collection.manage_collections_title"></FormattedMessage>
          </Typography>
        </Grid>
        <Box sx={{ display: "flex" }}>
          <Grid container style={{ border: "3px solid grey" }}>
            {open && images.length > 0 && (
              <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                {console.log(images)}
                {images.map((i) => (
                  <Grid item xs={2} key={i}>
                    {console.log()}
                    <Tooltip title={i} placement="bottom" arrow>
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
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Box>
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
                imageClicked !== "" ? "/images/uploads/" + imageClicked : null
              }
              width="100%"
            />
          </Dialog>
        )}
        <SimpleDialog open={openNew} onClose={handleCloseNewCol} />
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
