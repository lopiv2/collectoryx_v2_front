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

function SelectThemeTab() {
  const { userData, setUserData, userConfig, setUserConfig } =
    React.useContext(AppContext);
  const [themes, setThemes] = useState([]);
  //const [userStorage, setUserStorage] = useState(user);
  const [darkTheme, setDarkTheme] = useState(userConfig.darkTheme);
  const [themeClicked, setThemeClicked] = useState(userData.theme.id);
  const intl = useIntl();

  const handleChangeDark = (event) => {
    setDarkTheme(event.target.checked);
  };

  const submitChanges = () => {
    const save = ConfigService.saveConfigAppearance(
      userData.id,
      themeClicked,
      darkTheme,
      "appearance"
    )
      .then((response) => {
        setUserData((previous) => ({
          ...previous,
          theme: response.data.theme,
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

  const themeStyleClicked = {
    border: "2px solid green",
  };

  const themeStyleHover = {
    cursor: "pointer",
  };

  useEffect(() => {
    const collections = ConfigService.getAllThemes()
      .then((response) => {
        setThemes(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Grid container>
      <Grid item xs={5}>
        <Typography variant="h6" component="h5">
          <FormattedMessage id="app.config.appearance_choose_theme"></FormattedMessage>
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={darkTheme} onChange={handleChangeDark} />}
            label="Usar modo oscuro en tema"
          />
        </FormGroup>
        <Swiper
          slidesPerView={3}
          spaceBetween={1}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {themes !== undefined
            ? themes.map((item) => (
                <SwiperSlide key={item.id}>
                  <Card
                    key={item.id}
                    sx={{
                      height: 250,
                      minWidth: 200,
                      maxWidth: 200,
                      boxShadow: 5,
                    }}
                    style={
                      themeClicked === item.id
                        ? themeStyleClicked
                        : themeStyleHover
                    }
                    ml={200}
                    onClick={(e) => {
                      setThemeClicked(item.id);
                    }}
                  >
                    <CardHeader
                      title={item.name}
                      style={{ textAlign: "center" }}
                    ></CardHeader>
                    <ThemeTemplate
                      sx={{ fontSize: 200 }}
                      primarycolor={createColor(item.primaryTextColor)}
                      secondarycolor={createColor(item.secondaryTextColor)}
                      topbarcolor={createColor(item.topBarColor)}
                      sidebarcolor={createColor(item.sideBarColor)}
                      listitemcolor={createColor(item.listItemColor)}
                      backcolor={createColor(item.backgroundColor)}
                    ></ThemeTemplate>
                  </Card>
                </SwiperSlide>
              ))
            : null}
        </Swiper>
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

export default SelectThemeTab;
