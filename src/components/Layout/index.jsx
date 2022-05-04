import React, { useEffect } from 'react';
import { Router } from '../Router';
import TopToolBar from "../TopToolBar";
import SideBar from "../SideBar";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import CollectionsSpentCard from '../CollectionsSpentCard';
import TotalItemsCard from '../TotalItemsCard';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from '../Chart';
import Deposits from '../Deposits';
import Orders from '../Orders';
import { AppContext } from "../AppContext";
import "../Dashboard.css";
import { FormattedMessage } from 'react-intl';
import Copyright from '../Copyright';
import { Outlet } from 'react-router-dom';


const drawerWidth = 240;
const mdTheme = createTheme();

function Layout(props) {

    
    const { userName, setUserName, isLogged, setIsLogged } = React.useContext(AppContext);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openAnch = Boolean(anchorEl);

    
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('user'));
        const { user_name: userName } = user;
        setUserName(userName);
        //console.log(user);
    }, []);
    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <TopToolBar anchorEl={anchorEl} setAnchorEl={setAnchorEl} drawerWidth={drawerWidth} open={open} openAnch={openAnch} toggleDrawer={toggleDrawer}></TopToolBar>
                <SideBar drawerWidth={drawerWidth} open={open} openAnch={openAnch} toggleDrawer={toggleDrawer}></SideBar>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >

                    <Toolbar />
                    <Container maxWidth="xlg" sx={{ mt: 2, mb: 4 }}>
                    <Outlet></Outlet>
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
                        <Copyright sx={{ pt: 4 }} />
                    </Container>
                </Box>
                
            </Box>
        </ThemeProvider >
    );
}
export default Layout;