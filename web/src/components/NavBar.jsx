import { useContext, useState } from 'react';
import { NavLink } from 'react-router';
import {
  AppBar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

import { UserContext } from '../context/User';
import { routesConfig } from '../services/routing/routes';

export const NavBar = () => {
  const { user, logout } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    logout();
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {user &&
          user.user_name &&
          routesConfig
            .filter((route) => route.path !== '*')
            .map((route) => (
              <NavLink
                key={route.path}
                to={route.path}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  marginRight: 16,
                }}
              >
                <Typography variant="h6" component="div">
                  {route.name}
                </Typography>
              </NavLink>
            ))}
        {user.user_name}
        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
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
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};
