import React, { useState, useEffect, useRef } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { TextField } from "@mui/material";
import { Box, ListItem } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Grid, Card, CardContent, Avatar } from "@mui/material";
import { Button } from "@mui/material";
import ConfigService from "../app/api/config.api";
import "../styles/Dashboard.css";
import NoImage from "../images/no-photo-available.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Collections.css";
import { Tooltip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { AppContext } from "../components/AppContext";
import { FilterResultsByApiProvider } from "../utils/generic";

function ImportScrapper() {
  const navigate = useNavigate();
  const intl = useIntl();
  const [apisList, setApisList] = useState([]);
  const { userData, setUserData } = React.useContext(AppContext);
  const [selectedApi, setSelectedApi] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [searchString, setSearchString] = useState("");
  const [startSearch, setStartSearch] = useState(false);
  const [searching, setSearching] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const apiList = ConfigService.getAllApis(userData.id)
      .then((response) => {
        setApisList(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    console.log(results);
  }, [results]);

  const handleTextInputChange = (event) => {
    setSearchString(event.target.value);
  };

  const searchWebClick = () => {
    setStartSearch(true);
    const collectionSeries = ConfigService.getItemFromWeb(
      searchString,
      selectedApi
    ).then((response) => {
      setResults(FilterResultsByApiProvider(response.data, selectedApi));
      setSearching(false);
      setStartSearch(false);
      setShowResults(true);
    });
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
            onChange={handleTextInputChange}
          />
        </Grid>
        <Grid item xs={12} pt={2}>
          <Typography variant="h6" component="h4">
            <FormattedMessage
              id={
                showResults == false
                  ? "app.collection.select_option"
                  : "app.collection.add_collection_import_scrapper_search_results"
              }
            ></FormattedMessage>
          </Typography>
        </Grid>
      </Grid>
      {/*Listado de Apis*/}
      <Grid container sx={{ border: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {showResults === false &&
          apisList.map((item, index) => (
            <Grid item pl={2} pt={2} pb={2} >
              <Card key={index}>
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
                      setSelectedApi(item);
                    }}
                  />
                </Tooltip>
              </Card>
            </Grid>
          ))}
      </Grid>
      {startSearch === true ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={5} sx={{ border: 2 }}>
          {results.map((item, index) => (
            <Grid item xs={2}>
              <Card key={index}>
                <CardContent>
                  <Tooltip title={item.name} placement="bottom" arrow>
                    <Avatar
                      variant="rounded"
                      key={item.name}
                      sx={
                        selectedItem === item
                          ? avatarStyleClicked
                          : avatarStyleHover
                      }
                      src={item.image} // use normal <img> attributes as props
                      width="100%"
                      onClick={(e) => {
                        setSelectedItem(item);
                        console.log(item.name);
                      }}
                    />
                  </Tooltip>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Grid container>
        {showResults === false && (
          <Button
            variant="contained"
            onClick={() => {
              searchWebClick();
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
                  console.log(selectedItem);
                }}
              >
                <FormattedMessage id="app.collection.add_collection_import_scrapper_item"></FormattedMessage>
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => {
                  setResults([]);
                  setShowResults(false);
                }}
              >
                <FormattedMessage id="app.button.search_again"></FormattedMessage>
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default ImportScrapper;
