import React, { useState, useEffect } from "react";
import { FormattedMessage} from "react-intl";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import ConfigService from "../../app/api/config.api";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import { FormGroup } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import { Switch } from "@mui/material";
import { toast } from "react-toastify";
import { AppContext } from "../AppContext";


function DashboardDesignTab() {
  const { userData, userConfig, setUserConfig } =
    React.useContext(AppContext);
  const [expensivePanel, setExpensivePanel] = useState(userConfig.expensivePanel);
  const [wishlistPanel, setWishlistPanel] = useState(userConfig.wishlistPanel);
  const [recentPurchasePanel, setRecentPurchasePanel] = useState(userConfig.recentPurchasePanel);
  const [completedCollectionsPanel, setCompletedCollectionsPanel] = useState(userConfig.completedCollectionsPanel);

  const handleChangeExpensiveItem = (event) => {
    setExpensivePanel(event.target.checked);
  };

  const handleChangeWishlistItem = (event) => {
    setWishlistPanel(event.target.checked);
  };

  const handleChangeRecentPurchaseItem = (event) => {
    setRecentPurchasePanel(event.target.checked);
  };

  const handleChangeCompletedCollectionItem = (event) => {
    setCompletedCollectionsPanel(event.target.checked);
  };

  const submitChanges = () => {
    ConfigService.saveConfigDashboard(
      userData.id,
      expensivePanel,
      wishlistPanel,
      recentPurchasePanel,
      completedCollectionsPanel,
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
          wishlistPanel: response.data.wishlistPanel,
          recentPurchasePanel: response.data.recentPurchasePanel,
          completedCollectionsPanel: response.data.completedCollectionsPanel,
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
          <FormControlLabel
            control={<Switch checked={wishlistPanel} onChange={handleChangeWishlistItem} />}
            label={<FormattedMessage id="app.config.appearance_wishlist_tab_visible"></FormattedMessage>}
          />
          <FormControlLabel
            control={<Switch checked={recentPurchasePanel} onChange={handleChangeRecentPurchaseItem} />}
            label={<FormattedMessage id="app.config.appearance_recent_purchase_tab_visible"></FormattedMessage>}
          />
          <FormControlLabel
            control={<Switch checked={completedCollectionsPanel} onChange={handleChangeCompletedCollectionItem} />}
            label={<FormattedMessage id="app.config.appearance_collection_tab_visible"></FormattedMessage>}
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
