import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { TextField } from "@mui/material";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Avatar,
  Pagination,
  Checkbox,
  ListItem,
  MenuItem,
} from "@mui/material";
import { Button } from "@mui/material";
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { Dialog, DialogActions, DialogTitle } from "@material-ui/core";
import CircularProgress from "@mui/material/CircularProgress";
import { AppContext } from "../components/AppContext";
import {
  FilterResultsByApiProvider,
  CheckCountFieldNameApi,
} from "../utils/generic";
import ApiMetadataFields from "../components/ApiMetadata";
import { isUndefined } from "lodash";

function ImportScrapper() {
  const navigate = useNavigate();
  const intl = useIntl();
  const [apisList, setApisList] = useState([]);
  const { userData, setUserData } = React.useContext(AppContext);
  const [selectedApi, setSelectedApi] = useState();
  const [selectedItem, setSelectedItem] = useState(); //Item clicked for import
  const [sentItem, setSentItem] = useState(); //Item sent to API
  const [searchString, setSearchString] = useState("");
  const [startSearch, setStartSearch] = useState(false);
  const [importOwned, setImportOwned] = useState(false);
  const [openDupeDialog, setOpenDupeDialog] = useState(false);
  const [importMetadata, setImportMetadata] = useState(false);
  const [searching, setSearching] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [cardHover, setCardHover] = useState(null);
  const location = useLocation();
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [metadata, setMetadata] = useState("");
  const [searchAgain, setSearchAgain] = useState(false);
  const [showErrorNoApi, setShowErrorNoApi] = useState(false);
  const [metaFields, setMetaFields] = useState([]); //Metadata fields in collection

  const handleClose = () => {
    setOpenDupeDialog(false);
  };

  useEffect(() => {
    ConfigService.getAllApis(userData.id)
      .then((response) => {
        setApisList(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (startSearch === true) {
      searchWebClick();
    }
  }, [page, searchString, startSearch]);

  const handleChange = (e, p) => {
    setPage(p);
    setStartSearch(true);
  };

  const checkDuplicate = () => {
    ConfigService.getCollectionItemByData(selectedItem).then((response) => {
      //console.log(selectedItem);
      if (response.data === "") {
        importSelectedItem();
      } else {
        setOpenDupeDialog(true);
      }
    });
  };

  const importSelectedItem = () => {
    //Check if item is duplicated before import
    sentItem.own = importOwned;
    if (selectedApi.name.includes("Rebrickable")) {
      if (metadata.includes("sets")) {
        ConfigService.getSerieFromRebrickable(sentItem.serie, selectedApi).then(
          (response) => {
            sentItem.serie = response.data.name;
            ConfigService.importItemFromWeb(sentItem).then((response) => {
              if (response.status === 200) {
                toast.success(
                  <FormattedMessage id="app.collection.item-created"></FormattedMessage>,
                  { theme: "colored" }
                );
              }
            });
          }
        );
      } else {
        //If metadata is minifig, is a collectible minifigure
        sentItem.serie = "Collectible Minifigure";
        ConfigService.importItemFromWeb(sentItem).then((response) => {
          if (response.status === 200) {
            toast.success(
              <FormattedMessage id="app.collection.item-created"></FormattedMessage>,
              { theme: "colored" }
            );
          }
        });
      }
    } else {
      if (selectedApi.name.includes("GiantBomb")) {
        ConfigService.importItemFromWeb(sentItem).then((response) => {
          if (response.status === 200) {
            toast.success(
              <FormattedMessage id="app.collection.item-created"></FormattedMessage>,
              { theme: "colored" }
            );
          }
        });
      } else {
        ConfigService.importItemFromWeb(sentItem).then((response) => {
          if (response.status === 200) {
            toast.success(
              <FormattedMessage id="app.collection.item-created"></FormattedMessage>,
              { theme: "colored" }
            );
          }
        });
      }
    }
  };

  const handleTextInputChange = (event) => {
    setSearchString(event.target.value);
  };

  const handleImportOwned = (event) => {
    setImportOwned(event.target.checked);
  };

  const handleImportMetadata = (event) => {
    setImportMetadata(event.target.checked);
    getMetadataFields();
  };

  useEffect(() => {
    if (!isUndefined(selectedItem)) {
      getMetadataFields();
    }
  }, [selectedItem]);

  //When metadata importing is selected
  useEffect(() => {
    if (metaFields.length > 0) {
      sentItem.metadata = metaFields;
    }
  }, [metaFields]);

  const setValue = (dataKey, initialKey) => {
    //Find index in selectedItem to get the value to map
    var index = selectedItem.metadata.findIndex(
      (field) => field.name === dataKey
    );
    //Get the value from selected item
    var metaValue = "";
    if (selectedItem.metadata[index]?.value) {
      metaValue = selectedItem.metadata[index].value;
    } else {
      metaValue = "";
    }
    var newIndex = sentItem.metadata.findIndex(
      (field) => field.key === initialKey
    );
    //Set the sent item with the new value from mapping
    let newSentItem = { ...sentItem };
    newSentItem.metadata[newIndex].value = metaValue;
    setSentItem(newSentItem);
  };

  //Pick the metadata fields from collection
  const getMetadataFields = () => {
    setMetaFields([]);
    //Copy of selectedItem
    setSentItem({ ...selectedItem });
    ConfigService.getMetadataFields(selectedItem.collection).then(
      (response) => {
        response.data.map((f) => {
          const field = {
            id: f.id,
            key: f.name,
            value: "",
          };
          setMetaFields((fields) => [...fields, field]);
        });
      }
    );
  };

  const searchWebClick = () => {
    if (searchString === "" || searchString === undefined) {
      toast.error(
        <FormattedMessage id="app.config.general.api-no_search_string"></FormattedMessage>,
        { theme: "colored" }
      );
      return;
    }
    if (selectedApi.name.includes("DC Multiverse")) {
      ConfigService.getItemDCMultiverse(
        page,
        rowsPerPage,
        searchString,
        metadata
      ).then((response) => {
        if (response.data !== "") {
          setTotalPages(
            CheckCountFieldNameApi(response, selectedApi, rowsPerPage)
          );
          setResults(
            FilterResultsByApiProvider(
              response.data,
              selectedApi,
              location.state.id
            )
          );
        } else {
          setResults([]);
        }
        setSearching(false);
        setStartSearch(false);
        setShowResults(true);
      });
      return;
    }
    if (selectedApi.name.includes("Gijoe")) {
      ConfigService.getItemGijoe(
        page,
        rowsPerPage,
        searchString,
        metadata
      ).then((response) => {
        if (response.data !== "") {
          setTotalPages(
            CheckCountFieldNameApi(response, selectedApi, rowsPerPage)
          );
          setResults(
            FilterResultsByApiProvider(
              response.data,
              selectedApi,
              location.state.id
            )
          );
        } else {
          setResults([]);
        }
        setSearching(false);
        setStartSearch(false);
        setShowResults(true);
      });
      return;
    }
    if (selectedApi.name.includes("Marvel Legends")) {
      ConfigService.getItemMarvelLegends(
        page,
        rowsPerPage,
        searchString,
        metadata
      ).then((response) => {
        if (response.data !== "") {
          setTotalPages(
            CheckCountFieldNameApi(response, selectedApi, rowsPerPage)
          );
          setResults(
            FilterResultsByApiProvider(
              response.data,
              selectedApi,
              location.state.id
            )
          );
        } else {
          setResults([]);
        }
        setSearching(false);
        setStartSearch(false);
        setShowResults(true);
      });
      return;
    }
    if (selectedApi.name.includes("Minerals")) {
      ConfigService.getItemMinerals(
        page,
        rowsPerPage,
        searchString,
        metadata
      ).then((response) => {
        if (response.data !== "") {
          setTotalPages(
            CheckCountFieldNameApi(response, selectedApi, rowsPerPage)
          );
          setResults(
            FilterResultsByApiProvider(
              response.data,
              selectedApi,
              location.state.id
            )
          );
        } else {
          setResults([]);
        }
        setSearching(false);
        setStartSearch(false);
        setShowResults(true);
      });
      return;
    }
    if (selectedApi.name.includes("MOTU")) {
      ConfigService.getItemMotu(page, rowsPerPage, searchString, metadata).then(
        (response) => {
          if (response.data !== "") {
            setTotalPages(
              CheckCountFieldNameApi(response, selectedApi, rowsPerPage)
            );
            setResults(
              FilterResultsByApiProvider(
                response.data,
                selectedApi,
                location.state.id
              )
            );
          } else {
            setResults([]);
          }
          setSearching(false);
          setStartSearch(false);
          setShowResults(true);
        }
      );
      return;
    }
    if (selectedApi.name.includes("Star Wars")) {
      ConfigService.getItemStarWars(
        page,
        rowsPerPage,
        searchString,
        metadata
      ).then((response) => {
        if (response.data !== "") {
          setTotalPages(
            CheckCountFieldNameApi(response, selectedApi, rowsPerPage)
          );
          setResults(
            FilterResultsByApiProvider(
              response.data,
              selectedApi,
              location.state.id
            )
          );
        } else {
          setResults([]);
        }
        setSearching(false);
        setStartSearch(false);
        setShowResults(true);
      });
      return;
    }
    if (selectedApi.name.includes("TMNT")) {
      ConfigService.getItemTmnt(page, rowsPerPage, searchString, metadata).then(
        (response) => {
          if (response.data !== "") {
            setTotalPages(
              CheckCountFieldNameApi(response, selectedApi, rowsPerPage)
            );
            setResults(
              FilterResultsByApiProvider(
                response.data,
                selectedApi,
                location.state.id
              )
            );
          } else {
            setResults([]);
          }
          setSearching(false);
          setStartSearch(false);
          setShowResults(true);
        }
      );
      return;
    }
    if (selectedApi.name.includes("Hot Wheels")) {
      ConfigService.getItemHotWheels(
        page,
        rowsPerPage,
        searchString,
        metadata
      ).then((response) => {
        if (response.data !== "") {
          setTotalPages(
            CheckCountFieldNameApi(response, selectedApi, rowsPerPage)
          );
          setResults(
            FilterResultsByApiProvider(
              response.data,
              selectedApi,
              location.state.id
            )
          );
        } else {
          setResults([]);
        }
        setSearching(false);
        setStartSearch(false);
        setShowResults(true);
      });
      return;
    }
    if (selectedApi.apiLink !== "") {
      ConfigService.getItemFromWeb(
        page,
        rowsPerPage,
        searchString,
        selectedApi,
        metadata
      ).then((response) => {
        if (response.error) {
          console.log(response);
        }
        setTotalPages(
          CheckCountFieldNameApi(response, selectedApi, rowsPerPage)
        );
        var results = FilterResultsByApiProvider(
          response.data,
          selectedApi,
          location.state.id
        );
        //console.log(results)
        if (results) {
          results.map((result) => {
            if (result.metadata) {
              result.metadata.map((item) => {
                //For parts for Lego
                if (item.name.includes("inventory")) {
                  const parts = intl.formatMessage({
                    id: "app.collection.view_collections_item_parts",
                  });
                  item.value = item.value + " " + parts;
                }
              });
            }
          });
        }
        setResults(results);
        setSearching(false);
        setStartSearch(false);
        setShowResults(true);
      });
      return;
    } else {
      toast.error(
        <FormattedMessage id="app.config.general.api-no_url"></FormattedMessage>,
        { theme: "colored" }
      );
      return;
    }
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

  const cardStyle = {
    display: "block",
    width: 150,
    height: "auto",
  };

  const avatarCardStyle = {
    display: "block",
    width: "120%",
    height: 200,
  };

  const cardStyleHover = {
    cursor: "pointer",
    boxShadow: 15,
  };

  return (
    <Box sx={{ width: "60%" }}>
      <Grid container pb={2}>
        <Grid item xs={12} pt={2}>
          <Typography variant="h4" component="h4">
            <FormattedMessage id="app.collection.add_collection_import_scrapper"></FormattedMessage>
          </Typography>
        </Grid>
        <Grid item xs={12} pt={2}>
          <TextField
            sx={{ minWidth: 300 }}
            size="small"
            id="outlined-basic"
            name="logo"
            label={
              <FormattedMessage id="app.collection.add_collection_import_scrapper_search"></FormattedMessage>
            }
            variant="outlined"
            value={searchString}
            error={showErrorNoApi}
            helperText={
              showErrorNoApi && (
                <FormattedMessage id="app.button.no_api_selected"></FormattedMessage>
              )
            }
            onKeyPress={(ev) => {
              if (ev.key === "Enter" && !isUndefined(selectedApi)) {
                setShowErrorNoApi(false);
                searchWebClick();
                ev.preventDefault();
              }
              if (isUndefined(selectedApi)) {
                setShowErrorNoApi(true);
              }
            }}
            onChange={handleTextInputChange}
          />
        </Grid>
        <ApiMetadataFields
          selectedApi={selectedApi}
          metadata={metadata}
          setMetadata={setMetadata}
        ></ApiMetadataFields>
        <Grid item xs={12} pt={2}>
          <Typography variant="h6" component="h4">
            <FormattedMessage
              id={
                showResults === false
                  ? "app.collection.select_option"
                  : "app.collection.add_collection_import_scrapper_search_results"
              }
            ></FormattedMessage>
          </Typography>
          <Typography variant="body1">
            <FormattedMessage id="app.empty"></FormattedMessage>
          </Typography>
          <Typography variant="body1">
            <FormattedMessage
              id={
                showResults === true && results
                  ? results.length > 0
                    ? "app.empty"
                    : "app.collection.add_collection_import_scrapper_zero_results"
                  : "app.empty"
              }
            ></FormattedMessage>
          </Typography>
        </Grid>
      </Grid>
      {/*Listado de Apis*/}
      <Grid
        container
        sx={{ border: 2 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        justifyContent="flex-start"
      >
        {showResults === false &&
          searchAgain === false &&
          apisList.map((item, index) => (
            <Grid item pl={2} pt={2} pb={2} key={index}>
              <Card>
                <Tooltip title={item.name} placement="bottom" arrow>
                  <Avatar
                    variant="rounded"
                    key={item.name}
                    imgProps={{ referrerPolicy: "no-referrer" }}
                    sx={
                      selectedApi === item
                        ? avatarStyleClicked
                        : avatarStyleHover
                    }
                    src={item.logo} // use normal <img> attributes as props
                    width="100%"
                    onClick={(e) => {
                      setShowErrorNoApi(false);
                      setSelectedApi(item);
                    }}
                  />
                </Tooltip>
              </Card>
            </Grid>
          ))}
      </Grid>
      {results && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            overflowY: "scroll",
            maxHeight: "300px",
            border: results.length > 0 ? "3px solid black" : "0px solid black",
          }}
        >
          <Grid
            container
            columns={{ xs: 4, sm: 8, md: 12 }}
            justifyContent="space-evenly"
          >
            {startSearch === true ? (
              <CircularProgress />
            ) : (
              results.map((item, index) => (
                <Tooltip
                  title={
                    <>
                      <Typography variant="body1">{item.name}</Typography>
                      <Typography variant="body1">{item.serie}</Typography>
                    </>
                  }
                  key={index}
                  followCursor
                  arrow
                >
                  <Grid item key={index} pl={2} pt={2} pb={2}>
                    <Card
                      key={index}
                      style={cardStyle}
                      sx={[
                        cardHover === item
                          ? cardStyleHover
                          : {
                              boxShadow: 3,
                            },
                        selectedItem === item
                          ? avatarStyleClicked
                          : avatarStyleHover,
                      ]}
                      onClick={(e) => {
                        setSelectedItem(item);
                      }}
                      onMouseOver={() => {
                        setCardHover(item);
                      }}
                      onMouseOut={() => {
                        setCardHover(null);
                      }}
                    >
                      <CardContent
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Avatar
                          imgProps={{ referrerPolicy: "no-referrer" }}
                          style={avatarCardStyle}
                          variant="rounded"
                          key={item.name}
                          src={item.image} // use normal <img> attributes as props
                          width="100%"
                        />
                      </CardContent>
                      {item.name}
                    </Card>
                  </Grid>
                </Tooltip>
              ))
            )}
          </Grid>
        </Box>
      )}
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
      <Grid>
        <Grid item xs={12}>
          <Box ml={-1}>
            <Checkbox
              value={importOwned}
              checked={importOwned}
              onChange={handleImportOwned}
            ></Checkbox>
            <Typography variant="body1" display="inline">
              <FormattedMessage id="app.collection.add_collection_import_scrapper_owned"></FormattedMessage>
            </Typography>
          </Box>
        </Grid>
        {selectedItem && selectedItem.metadata ? (
          selectedItem.metadata.length > 0 ? (
            <Grid item xs={12}>
              <Box ml={-1}>
                <Checkbox
                  value={importMetadata}
                  checked={importMetadata}
                  onChange={handleImportMetadata}
                ></Checkbox>
                <Typography variant="body1" display="inline">
                  <FormattedMessage id="app.collection.add_collection_import_scrapper_metadata"></FormattedMessage>
                </Typography>
              </Box>
            </Grid>
          ) : null
        ) : null}
        {importMetadata === true && (
          <Grid container item xs={12}>
            {metaFields.map((item, index) => (
              <ListItem divider key={index}>
                <Grid item xs={5}>
                  <TextField
                    id="outlined-basic"
                    size="small"
                    label={item.key}
                    value={item.key}
                    variant="outlined"
                    inputProps={{
                      sx: { fontSize: { xs: ".7rem", xl: "1rem" } },
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  {" -> "}
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    defaultValue=""
                    select
                    id="demo-simple-select"
                    size="small"
                    onChange={(e) => setValue(e.target.value, item.key)}
                  >
                    <MenuItem key="empty" value=""></MenuItem>
                    {selectedItem.metadata?.map((option) => {
                      return (
                        <MenuItem key={option.name} value={option.name}>
                          {option.name ?? option.name}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </Grid>
              </ListItem>
            ))}
          </Grid>
        )}
      </Grid>
      <Grid container pt={2}>
        {showResults === false && (
          <Button
            variant="contained"
            onClick={() => {
              setStartSearch(true);
              //searchWebClick();
            }}
          >
            <FormattedMessage id="app.button.accept"></FormattedMessage>
          </Button>
        )}
        {showResults === true && (
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                disabled={selectedItem ? false : true}
                color="success"
                onClick={() => {
                  checkDuplicate();
                  //importSelectedItem();
                }}
              >
                <FormattedMessage id="app.collection.add_collection_import_scrapper_item"></FormattedMessage>
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setResults([]);
                  setShowResults(false);
                  setTotalPages(0);
                  setPage(1);
                  setImportMetadata(false);
                  //setMetadata("")
                  setSelectedItem();
                  setSearchAgain(true);
                  setStartSearch(true);
                  //searchWebClick();
                }}
              >
                <FormattedMessage id="app.button.search_again"></FormattedMessage>
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => {
                  setSelectedApi(undefined);
                  setResults([]);
                  setShowResults(false);
                  setTotalPages(0);
                  setPage(1);
                  setImportMetadata(false);
                  setMetadata("");
                  setSelectedItem();
                  setSearchAgain(false);
                }}
              >
                <FormattedMessage id="app.button.change_api"></FormattedMessage>
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
      {openDupeDialog && (
        <Dialog
          disableEnforceFocus
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
          style={{ maxWidth: false, maxHeight: "100%", minHeight: "350px" }}
          open={openDupeDialog}
          onClose={handleClose}
        >
          <DialogTitle id="confirm-dialog"></DialogTitle>
          <Grid
            container
            spacing={{ xs: 2, md: 5 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            width="100%"
          >
            <Grid item ml={2} mt={2} mr={2} mb={2}>
              <Typography display="inline" variant="h4" color="red">
                <FormattedMessage id="app.collection.add_collection_import_scrapper_duplicated"></FormattedMessage>
              </Typography>
            </Grid>
          </Grid>
          <Grid item ml={2} mt={2} mr={2} mb={2}>
            <FormattedMessage id="app.dialog.confirm_import"></FormattedMessage>
          </Grid>
          <DialogActions>
            <Grid container>
              <Grid item xs={3} ml={12}>
                <Button
                  variant="contained"
                  onClick={() => setOpenDupeDialog(false)}
                >
                  <FormattedMessage id="app.button.no"></FormattedMessage>
                </Button>
              </Grid>
              <Grid item xs={4} ml={2}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenDupeDialog(false);
                    importSelectedItem();
                  }}
                >
                  <FormattedMessage id="app.button.yes"></FormattedMessage>
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default ImportScrapper;
