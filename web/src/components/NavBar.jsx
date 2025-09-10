import { useContext, useState } from 'react'; //(React): estado local y acceso al contexto.
import { NavLink } from 'react-router';
import {
  AppBar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from '@mui/material'; //para la barra superior y el menú.
import AccountCircle from '@mui/icons-material/AccountCircle'; //iconito de usuario.

import { UserContext } from '../context/User'; //de ahí saco el usuario y logout

export const NavBar = () => {
  const { user, logout } = useContext(UserContext); //cojo el usuario y la función de salir.
  const [anchorEl, setAnchorEl] = useState(null); //controlar el ancla del menú (si hay ancla, si el menú está abierto)

  const handleLogout = () => {
    logout();
    handleClose();
  }; //llama a logout() y no cierra el menú (porque, ¿para qué? mantenerlo abierto es muy zen).

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget); //abre el menú guardando e.currentTarget en anchorEl.
  };

  const handleClose = () => {
    setAnchorEl(null); //cierra el menú (pone null).
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <NavLink to={'/'}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Home
          </Typography>
        </NavLink>
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
