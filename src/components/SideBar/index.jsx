import React, { useEffect } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Logo from "../../assets/Collectoryx_Logo.png";
import MainListItems from '../listItems';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import MuiDrawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

//console.log(props.toggleDrawer);


export default function SideBar(props) {



    return (
        <Drawer variant="permanent" open={props.open}>
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: [1],
                }}
            >
                <LazyLoadImage
                    alt=""
                    height={200}
                    className="logo"
                    src={Logo} // use normal <img> attributes as props
                    width={"100%"} />
                <IconButton onClick={props.toggleDrawer}>
                    <ChevronLeftIcon />
                </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
                {MainListItems()}
                <Divider sx={{ my: 1 }} />
            </List>
        </Drawer>


    );
}