import { useContext, useState } from 'react';
import { NavLink } from 'react-router';
import {
  AppBar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Button,
  Collapse,
  Box,
  ClickAwayListener,
} from '@mui/material';

import AccountCircle from '@mui/icons-material/AccountCircle';

import Sidebar from './Sidebar';
import { UserContext } from '../context/User';
import SignUpForm from '../pages/SignUpForm';
import InkFindersLogo from '../assets/InkFindersLogo.png';
import { Login } from '../pages/LoginPage';

export const NavBar = () => {
  const { user, logout } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const loginForm = () => {
    setShowLoginForm((prev) => !prev);
    setShowSignUpForm(false);
  };

  const signUpForm = () => {
    setShowSignUpForm((prev) => !prev);
    setShowLoginForm(false);
  };

  const handleLogin = () => {};

  const handleSignUp = () => {};

  return (
    <AppBar position="static">
      <Toolbar>
        <Sidebar />
        <NavLink
          to={'/'}
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            flexGrow: 1,
          }}
        >
          <img
            src={InkFindersLogo}
            alt="Logo"
            style={{ height: 40, marginRight: 10 }}
          />

          <Typography variant="h6" component="div">
            InkFinders
          </Typography>
        </NavLink>

        {user.user_name}

        <Box
          sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}
        >
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
          {!user || Object.keys(user).length === 0 ? (
            <>
              <Box sx={{ position: 'relative', ml: 1 }}>
                <Button variant="contained" onClick={loginForm}>
                  Login
                </Button>
                <Collapse
                  in={showLoginForm}
                  timeout="auto"
                  unmountOnExit
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    zIndex: 10,
                    mt: 1,
                    backgroundColor: 'background.paper',
                    boxShadow: 3,
                    borderRadius: 1,
                    maxWidth: 320,
                    width: 'max-content',
                  }}
                >
                  <ClickAwayListener
                    onClickAway={() => setShowLoginForm(false)}
                  >
                    <Box>
                      <Login onSubmit={handleLogin} />
                    </Box>
                  </ClickAwayListener>
                </Collapse>
              </Box>

              <Box sx={{ position: 'relative', ml: 1 }}>
                <Button variant="contained" onClick={signUpForm}>
                  Sign In
                </Button>
                <Collapse
                  in={showSignUpForm}
                  timeout="auto"
                  unmountOnExit
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    zIndex: 10,
                    mt: 1,
                    backgroundColor: 'background.paper',
                    boxShadow: 3,
                    borderRadius: 1,
                    maxWidth: 320,
                    width: 'max-content',
                  }}
                >
                  <ClickAwayListener
                    onClickAway={() => setShowSignUpForm(false)}
                  >
                    <Box>
                      <SignUpForm onSubmit={handleSignUp} />
                    </Box>
                  </ClickAwayListener>
                </Collapse>
              </Box>
            </>
          ) : null}
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};
