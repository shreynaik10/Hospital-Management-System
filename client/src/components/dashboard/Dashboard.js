import Header from "../Layout/Header/Header";
import Sidebar from "../Layout/Sidebar/Sidebar";
import styles from './Dashboard.module.css';
// import  './Dashboard.module.css';
// import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { Outlet } from "react-router-dom";


import { UserContext } from '../../Context/UserContext'
import React, { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";



const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));


export default function Dashboard() {
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const { currentUser, signInUser, isLoggedIn } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token") != null && localStorage.getItem("currentUser") != null) {
            let user = JSON.parse(localStorage.getItem("currentUser"));
            let token = localStorage.getItem("token")
            signInUser(user, token);
        }
        else {
            navigate("/login");
        }
    }, [isLoggedIn]);



    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Header open={open} handleDrawerOpen={handleDrawerOpen} headerTitle="Dashboard" />
            <Sidebar open={open} handleDrawerClose={handleDrawerClose} handleDrawerOpen={handleDrawerOpen} />
            <Outlet />
        </Box>
    );
}
