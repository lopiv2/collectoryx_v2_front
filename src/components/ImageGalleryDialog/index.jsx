import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FormattedMessage } from "react-intl";
import {
  Grid,
  Box,
  Avatar,
  TextField,
  Typography,
  Pagination,
  Button,
  MenuItem,
} from "@mui/material";
import { Tooltip } from "@mui/material";
import ConfigService from "../../app/api/config.api";
import { AppContext } from "../../components/AppContext";

const ImageGalleryDialog = (props) => {
  const { title, open, setOpen, onConfirm, setImageSelected } = props;
  const [images, setImages] = useState([]);
  const [imageClicked, setImageClicked] = useState();
  const { userData, setUserData } = React.useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [orderDirection, setOrderDirection] = useState("up");
  const [isLoading, setLoading] = useState(true);
  const [rowsOrder, setRowsOrder] = useState("name");

  useEffect(() => {
    setPage(0);
    fetchData(0, rowsPerPage, rowsOrder, searchQuery);
  }, [open]);

  const handleChangeShowItems = (event) => {
    setRowsPerPage(event);
    setPage(0);
    fetchData(0, event, rowsOrder, searchQuery);
  };

  const handleChange = (e, p) => {
    setLoading(true);
    setPage(p);
    fetchData(p - 1, rowsPerPage, rowsOrder, searchQuery);
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
      filteredResponse.map((i) => setImages((images) => [...images, i.path]));
      setLoading(false);
    });
    //}
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

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog"
      style={{ maxWidth: "100%", maxHeight: "100%" }}
      disableEnforceFocus
    >
      <DialogTitle id="confirm-dialog">
        <Typography component="p" variant="h5" align="center">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item pt={1}>
            <Typography variant="body1">
              <FormattedMessage id="app.dialog.search_image"></FormattedMessage>
            </Typography>
          </Grid>
          <Grid item pb={1}>
            <TextField
              variant="outlined"
              size="small"
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
            ></TextField>
          </Grid>
        </Grid>
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            overflowY: "scroll",
            maxHeight: "90px",
            border: "3px solid grey",
          }}
        >
          <Grid container>
            {open && images.length > 0 && (
              <Grid container justifyContent="space-between">
                {images.map((i) => (
                  <Grid item xs={2.4} key={i}>
                    {/*console.log(i)*/}
                    <Tooltip title={i} placement="bottom" arrow>
                      <Avatar
                        imgProps={{ referrerPolicy: "no-referrer" }}
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
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            setImages([]);
            onConfirm();
          }}
        >
          <FormattedMessage id="app.button.accept"></FormattedMessage>
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            setImages([]);
          }}
        >
          <FormattedMessage id="app.button.cancel"></FormattedMessage>
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ImageGalleryDialog;
