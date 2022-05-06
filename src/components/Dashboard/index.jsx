import React, { useEffect } from "react";
import CollectionsSpentCard from '../CollectionsSpentCard';
import TotalItemsCard from '../TotalItemsCard';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from '../Chart';
import Deposits from '../Deposits';
import Orders from '../Orders';

export default function Dashboard (props) {
    return (
        <Grid container spacing={3}>
            {/*Spent Money in all collections*/}
            <Grid item xs={10} md={8} lg={4}>
                <CollectionsSpentCard item xs={12} md={8} lg={9}></CollectionsSpentCard>
            </Grid>
            {/*Total items in all collections*/}
            <Grid item xs={10} md={8} lg={4}>
                <TotalItemsCard item xs={12} md={8} lg={9}></TotalItemsCard>
            </Grid>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                    }}
                >
                    <Chart />
                </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                    }}
                >
                    <Deposits />
                </Paper>
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