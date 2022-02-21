import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useHistory } from 'react-router-dom';
export default function Navbar({ user_name }) {
  const history = useHistory();
  const logoutUser = () => {
    localStorage.removeItem("user_token");
    history.replace('/login')
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            File Management System
          </Typography>
          <Typography>Hey  👋 { user_name }</Typography>
          <Button color="inherit" onClick={logoutUser}>Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}