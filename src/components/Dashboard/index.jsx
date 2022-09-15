import React, { useEffect, useState } from "react";
import CollectionsSpentCard from '../CollectionsSpendCard';
import TotalItemsCard from '../TotalItemsCard';
import TotalCollectionsCard from "../TotalCollectionsCard";
import MostValuableItem from "../MostValuableItem";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Box } from "@mui/material";
import LinearChartYearly from "../LinearChartYearly";
import BarChartYearly from "../BarChartYearly";
import Deposits from '../Deposits';
import Orders from '../Orders';
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
                    {userConfig.expensivePanel===true && <MostValuableItem item xs={12} md={8} lg={9}></MostValuableItem>}
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
                    >
                        <Box>
                            <LinearChartYearly />
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
                    >
                        <Box>
                            <BarChartYearly />
                        </Box>
                    </Paper>
                </Grid>
                {/* Recent Deposits */}
                <Grid item xs={12} md={4} lg={3}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 274,
                        }}
                    >
                        <Deposits />
                    </Paper>
                </Grid>
            </Grid>

            {/* Recent Orders */}
            <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Orders />
                </Paper>
            </Grid>
        </Grid>
    )
}