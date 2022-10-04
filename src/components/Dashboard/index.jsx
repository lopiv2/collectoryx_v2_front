import React, { useEffect, useState } from "react";
import CollectionsSpentCard from '../CollectionsSpendCard';
import TotalItemsCard from '../TotalItemsCard';
import TotalCollectionsCard from "../TotalCollectionsCard";
import MostValuableItem from "../MostValuableItem";
import WishlistCard from "../WishListCard";
import CompletedCollectionsCard from "../CompletedCollectionsCard";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Box } from "@mui/material";
import LinearChartYearly from "../LinearChartYearly";
import BarChartYearly from "../BarChartYearly";
import RecentOrders from "../RecentOrders";
import AuthService from "../../app/api/auth.api";
import { AppContext } from "../AppContext";

export default function Dashboard(props) {
    const { userData, setUserData, userConfig, setUserConfig } =
        React.useContext(AppContext);

    return AuthService.checkUserLogged() === "USER_ROLE" && (
        <Grid container spacing={3} mt={2}>
            <Grid container spacing={3} ml={0}>
                {/*Spent Money in all collections*/}
                <Grid item xs={10} md={8} lg={4}>
                    <CollectionsSpentCard item xs={12} md={8} lg={9}></CollectionsSpentCard>
                </Grid>
                {/*Total items in all collections*/}
                <Grid item xs={10} md={8} lg={4}>
                    <TotalItemsCard item xs={12} md={8} lg={9}></TotalItemsCard>
                </Grid>
                <Grid item xs={10} md={8} lg={4}>
                    <TotalCollectionsCard item xs={12} md={8} lg={9}></TotalCollectionsCard>
                </Grid>
                <Grid item xs={10} md={8} lg={4}>
                    {userConfig.expensivePanel === true && <MostValuableItem item xs={12} md={8} lg={9}></MostValuableItem>}
                </Grid>
                <Grid item xs={10} md={8} lg={4}>
                    {userConfig.wishlistPanel === true && <WishlistCard item xs={12} md={8} lg={9}></WishlistCard>}
                </Grid>
                <Grid item xs={10} md={8} lg={4}>
                    {userConfig.completedCollectionsPanel === true && <CompletedCollectionsCard item xs={12} md={8} lg={9}></CompletedCollectionsCard>}
                </Grid>
            </Grid>
            {/*Charts*/}
            <Grid container spacing={3} ml={0} mt={1}>
                <Grid item xs={12} md={8} lg={4}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                        elevation={6}
                    >
                        <Box>
                            <LinearChartYearly userData={userData} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={8} lg={4}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                        elevation={6}
                    >
                        <Box>
                            <BarChartYearly userData={userData} />
                        </Box>
                    </Paper>
                </Grid>
                {/*<Grid item xs={12} md={8} lg={4}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                        elevation={6}
                    >
                        <Box>
                            <BarChartYearly />
                        </Box>
                    </Paper>
                    </Grid>*/}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }} elevation={6}>
                        <RecentOrders />
                    </Paper>
                </Grid>
            </Grid>
        </Grid>
    )
}