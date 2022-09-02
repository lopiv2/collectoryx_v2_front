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
import OptionsService from "../components/DropDownOptions";
import { Tooltip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { AppContext } from "../components/AppContext";

function ImportScrapper() {
  const navigate = useNavigate();
  const intl = useIntl();
  const [collectionList, setCollectionList] = useState([]);
  const { userData, setUserData } = React.useContext(AppContext);
  const [imageClicked, setImageClicked] = useState();
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    setCollectionList(OptionsService.scrappingWebs)
  }, []);

  useEffect(() => {
    //console.log(collectionList);
  }, [collectionList])

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
      <Typography variant="h4" component="h4">
        <FormattedMessage id="app.collection.add_collection_import_scrapper"></FormattedMessage>
      </Typography>
      <Grid container>
        <Grid item xs={4} pt={2}>
          <Typography variant="h6" component="h4">
            <FormattedMessage id="app.collection.add_collection_import_scrapper"></FormattedMessage>
          </Typography>
        </Grid>
      </Grid>
      <Grid container sx={{ border: 2 }}>
        <Grid item>
          <TextField
            sx={{ minWidth: 300 }}
            size="small"
            id="outlined-basic"
            name="logo"
            label={
              <FormattedMessage id="app.collection.import_collection_file"></FormattedMessage>
            }
            variant="outlined"
            value={searchString}
            onChange={(e) => setSearchString(e)}
          />
        </Grid>

        {collectionList.map((item, index) => (
          <Card key={index}>
            <CardContent>
              <Grid item xs={2}>
                <Tooltip
                  title={item.label}
                  placement="bottom"
                  arrow
                >
                  <Avatar
                    variant="rounded"
                    sx={
                      imageClicked === item
                        ? avatarStyleClicked
                        : avatarStyleHover
                    }
                    src={item.logo} // use normal <img> attributes as props
                    width="100%"
                    onClick={(e) => {
                      console.log(e.target.value);
                    }}
                  />
                </Tooltip>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Box>
  );
}

export default ImportScrapper;
