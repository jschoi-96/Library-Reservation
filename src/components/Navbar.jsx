import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Switch from "@mui/material/Switch";

import { useState, useEffect } from "react";
import { login, logout, onUserStateChange } from "../api/firebase";

import User from "./User";
import { Link, useLocation } from "react-router-dom";
import "../api/firebase.js";

export default function Navbar() {
  const [user, setUser] = useState();
  const [checked, setChecked] = useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    onUserStateChange((user) => {
      setUser(user);
    });
  }, []);

  // const label = { inputProps: { "aria-label": "Switch demo" } };

  const handleLogin = () => {
    login()
      .then((user) => {})
      .catch((error) => {
        console.error(error);
      });
  };

  const handleLogout = () => {
    // if user is logged out, set username to null
    logout().then((user) => setUser(user));
  };

  const location = useLocation();

  useEffect(() => {}, [location]);

  return (
    <nav>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar sx={{ bgcolor: "rgb(52, 59, 84)" }}>
            <BorderColorIcon sx={{ fontSize: 25, mr: 2 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Library Reservation
            </Typography>
            {/* <div>
              <Switch
                checked={checked}
                onChange={handleChange}
                color="default"
                inputProps={{ "aria-label": "controlled" }}
              />
            </div> */}
            {!user && (
              <Button
                color="inherit"
                onClick={handleLogin}
              >
                {" "}
                Login{" "}
              </Button>
            )}
            {user && <User user={user} />}
            {/* {user && (
              <Button
                sx={{
                  color: "inherit",
                  mr: 2,
                }}
              >
                {" "}
                Data{" "}
              </Button>
            )} */}
            <Button
              sx={{ color: "white" }}
              href="usage"
            >
              {" "}
              Usage{" "}
            </Button>
            {location.pathname === "/reserve" && (
              <Button
                sx={{ color: "white" }}
                href="/"
              >
                {" "}
                Home{" "}
              </Button>
            )}

            {location.pathname === "/usage" && (
              <Button
                sx={{ color: "white" }}
                href="/"
              >
                {" "}
                Home{" "}
              </Button>
            )}

            {user && (
              <Button
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
    </nav>
  );
}
