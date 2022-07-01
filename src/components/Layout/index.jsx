import React from 'react';
import TopToolBar from "../TopToolBar";
import SideBar from "../SideBar";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import "../../styles/Dashboard.css";
import Copyright from '../Copyright';
import { Outlet } from 'react-router-dom';


const drawerWidth = 240;
const mdTheme = createTheme();

function Layout(props) {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openAnch = Boolean(anchorEl);


    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

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
                        <Copyright sx={{ pt: 4 }} />
                    </Container>
                </Box>

            </Box>
        </ThemeProvider >
    );
}
export default Layout;