import React, { useState, useEffect, useContext } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import "../styles/Dashboard.css";
import { ToastContainer } from "react-toastify";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from '@mui/icons-material/Cancel';
import Markdown from "markdown-to-jsx";
import { Context } from "../components/Wrapper";


function Updates() {
  const version = window.env.VERSION;
  const [changelogText, setChangelogText] = useState("");
  const context = useContext(Context);
  const [langChangelog, setLangchangelog] = useState('es');
  const [isLatestVersion, setIsLatestVersion] = useState(false);

  async function fetchHtml() {
    setChangelogText(await (await fetch('../changelog_' + langChangelog + '.md')).text());
  }


  useEffect(() => {
    fetchHtml();
  }, [langChangelog])

  useEffect(() => {
    setLangchangelog(context.locale.substring(0, 2))
  }, [context.locale]);

  return (
    <Box>
      <ToastContainer autoClose={2000} />
      <Grid container justifyContent="flex-end">
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            <FormattedMessage id="app.sidemenu.options.updates"></FormattedMessage>
          </Typography>
          <Typography variant="h6" component="h6">
            {!isLatestVersion ?
              <Grid>
                <CheckCircleIcon
                  sx={{
                    color: "green",
                    fontSize: "38px",
                    paddingRight: "2px",
                    paddingTop: "2px",
                  }}
                ></CheckCircleIcon>
                <FormattedMessage id="app.changelog.version_installed"></FormattedMessage>
              </Grid>
              : <Grid>
                <CancelIcon
                  sx={{
                    color: "red",
                    fontSize: "38px",
                    paddingRight: "2px",
                    paddingTop: "2px",
                  }}
                ></CancelIcon>
                <FormattedMessage id="app.changelog.version_installed"></FormattedMessage>
              </Grid>}
          </Typography>
          <Markdown options={{ forceBlock: true }}>{changelogText}</Markdown>
        </Grid>
      </Grid>
      <Grid container pt={2}></Grid>
    </Box>
  );
}

export default Updates;
