import React, { useState, useEffect } from "react";
import { CardHeader, Typography } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { Paper } from "@mui/material";
import { Button } from "@mui/material";
import ConfigService from "../../app/api/config.api";
import { ColorPicker, createColor } from "material-ui-color";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import { Pagination, Navigation, EffectCoverflow } from "swiper";
import { FormGroup } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import { Switch } from "@mui/material";
import ThemeTemplate from "../ThemeFiller";
import { toast } from "react-toastify";
import { Card, CardContent, CardActions, CardMedia } from "@mui/material";
import { AppContext } from "../AppContext";
import { CreateTheme } from "../../utils/generic";


function DashboardDesignTab() {
  const { userData, setUserData, userConfig, setUserConfig } =
    React.useContext(AppContext);
  const [expensivePanel, setExpensivePanel] = useState(userConfig.expensivePanel);
  const intl = useIntl();

  const handleChangeExpensiveItem = (event) => {
    setExpensivePanel(event.target.checked);
  };

  const submitChanges = () => {
    const save = ConfigService.saveConfigDashboard(
      userData.id,
      expensivePanel,
      "dashboard"
    )
      .then((response) => {
        if (response.status === 200) {
          toast.success(
            <FormattedMessage id="app.config.saved"></FormattedMessage>,
            { theme: "colored" }
          );
        }
        setUserConfig((previous) => ({
          ...previous,
          expensivePanel: response.data.expensivePanel,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const modif = JSON.stringify(userData);
    localStorage.setItem("user", modif);
  }, [userData]);


  return (
    <Grid container>
      <Grid item xs={5}>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={expensivePanel} onChange={handleChangeExpensiveItem} />}
            label={<FormattedMessage id="app.config.appearance_expensive_tab_visible"></FormattedMessage>}
          />
        </FormGroup>
        <Grid item mt={1}>
          <Button
            variant="contained"
            type="submit"
            form="form"
            onClick={submitChanges}
          >
            <FormattedMessage id="app.button.apply"></FormattedMessage>
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default DashboardDesignTab;
