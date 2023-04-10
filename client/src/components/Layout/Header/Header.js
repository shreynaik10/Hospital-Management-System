import styles from './Header.module.css'
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import React, { useContext } from 'react';
import { UserContext } from '../../../Context/UserContext'
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Header = ({ open, handleDrawerOpen, headerTitle }) => {
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, signOutUser } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const redirectToHome = () => {
    navigate("/");
  }
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    signOutUser();
    handleClose(null);
  };


  return (
    <AppBar position="fixed" open={open} style={{ backgroundColor: '#fff', color: "#31b372", boxShadow: "None" }} >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: 'none' }),
          }}

        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h4" noWrap component="div" onClick={redirectToHome} sx={{ flexGrow: 1, fontWeight: 'bolder' }} >
          {/* {headerTitle} */}
          Green Hills Hospital
        </Typography>
        {isLoggedIn && (
          <div className={styles.accountIcon}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              
            >
              <AccountCircle style={{ fontSize: 42, marginRight: 8 }} />
              <div style={{ display: 'flex', flexDirection: "column", alignItems: "start" }} >
                <span style={{ fontSize: 19, color: 'grey', marginTop: 3 }} > {currentUser.firstName} {currentUser.lastName}</span>
                <span style={{ fontSize: 12, color: 'grey' }} > {currentUser.userType}</span>
              </div>


            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header;
