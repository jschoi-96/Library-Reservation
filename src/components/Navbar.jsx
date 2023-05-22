import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import BorderColorIcon from "@mui/icons-material/BorderColor";

import { useState, useEffect } from "react";
import { login, logout, onUserStateChange } from "../api/firebase";
import User from "./User";

export default function ButtonAppBar() {
  const [user, setUser] = useState();

  useEffect(() => {
    onUserStateChange((user) => {
      console.log(user);
      setUser(user);
    });
  }, []);

  const handleLogin = () => {
    login().then((user) => setUser(user)); // if login successfully, set user's name
  };

  const handleLogout = () => {
    // if user is logged out, set username to null
    logout().then((user) => setUser(user));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <BorderColorIcon sx={{ fontSize: 25, mr: 2 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Library Reservation
          </Typography>
          {!user && (
            <Button
              sx={{
                border: 1,
                borderRadius: 20,
              }}
              color="inherit"
              onClick={handleLogin}
            >
              {" "}
              Login{" "}
            </Button>
          )}
          {user && <User user={user} />}
          {user && (
            <Button
              sx={{
                color: "inherit",
                mr: 2,
              }}
            >
              {" "}
              Data{" "}
            </Button>
          )}
          {user && (
            <Button
              sx={{
                border: 1,
                borderRadius: 20,
                "&:hover": {
                  color: "warning.main",
                },
              }}
              color="inherit"
              onClick={handleLogout}
            >
              {" "}
              Logout{" "}
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
