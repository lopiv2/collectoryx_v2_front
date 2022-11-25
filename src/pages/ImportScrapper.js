import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { TextField } from "@mui/material";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import { Grid, Card, CardContent, Avatar, Pagination } from "@mui/material";
import { Button } from "@mui/material";
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { AppContext } from "../components/AppContext";
import {
  FilterResultsByApiProvider,
  CheckCountFieldNameApi,
  CheckSerieApiRebrickable,
} from "../utils/generic";
import ApiMetadataFields from "../components/ApiMetadata";
import { isUndefined } from "lodash";

function ImportScrapper() {
  const navigate = useNavigate();
  //const intl = useIntl();
  const [apisList, setApisList] = useState([]);
  const { userData, setUserData } = React.useContext(AppContext);
  const [selectedApi, setSelectedApi] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [searchString, setSearchString] = useState("");
  const [startSearch, setStartSearch] = useState(false);
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

  const importSelectedItem = () => {
    if (selectedApi.name.includes("Rebrickable")) {
      ConfigService.getSerieFromRebrickable(
        selectedItem.serie,
        selectedApi
      ).then((response) => {
        selectedItem.serie = response.data.name;
        ConfigService.importItemFromWeb(selectedItem).then((response) => {
          if (response.status === 200) {
            toast.success(
              <FormattedMessage id="app.collection.item-created"></FormattedMessage>,
              { theme: "colored" }
            );
            //console.log(response.data)
          }
        });
      });
    } else {
      ConfigService.importItemFromWeb(selectedItem).then((response) => {
        if (response.status === 200) {
          toast.success(
            <FormattedMessage id="app.collection.item-created"></FormattedMessage>,
            { theme: "colored" }
          );
        }
      });
    }
  };

  const handleTextInputChange = (event) => {
    setSearchString(event.target.value);
  };

  const searchWebClick = () => {
    if (searchString === "" || searchString === undefined) {
      toast.error(
        <FormattedMessage id="app.config.general.api-no_search_string"></FormattedMessage>,
        { theme: "colored" }
      );
    } else {
      if (selectedApi.name.includes("Marvel Legends")) {
        ConfigService.getItemMarvelLegends(
          page,
          rowsPerPage,
          searchString,
          metadata
        ).then((response) => {
          console.log(response.data);
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
          setSearching(false);
          setStartSearch(false);
          setShowResults(true);
        });
        return
      } else {
        if (selectedApi.apiLink !== "") {
          ConfigService.getItemFromWeb(
            page,
            rowsPerPage,
            searchString,
            selectedApi,
            metadata
          ).then((response) => {
            console.log(response.data);
            if (response.error) {
              console.log(response);
            }
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
            setSearching(false);
            setStartSearch(false);
            setShowResults(true);
          });
        } else {
          toast.error(
            <FormattedMessage id="app.config.general.api-no_url"></FormattedMessage>,
            { theme: "colored" }
          );
        }
      }
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
                <Tooltip title={item.name} key={index} followCursor arrow>
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
        {showResults === true && (
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                disabled={selectedItem ? false : true}
                color="success"
                onClick={() => {
                  importSelectedItem();
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
                  setSearchAgain(true);
                  setStartSearch(true);
                  searchWebClick();
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
                  setSearchAgain(false);
                }}
              >
                <FormattedMessage id="app.button.change_api"></FormattedMessage>
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default ImportScrapper;
