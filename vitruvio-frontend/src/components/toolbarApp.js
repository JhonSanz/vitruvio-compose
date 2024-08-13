"use client";

import { useEffect, useState, Fragment } from "react";
import { useRouter, useParams } from "next/navigation";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import ForestIcon from '@mui/icons-material/Forest';
import SaveIcon from '@mui/icons-material/Save';



export default function ToolbarApp() {
  const [displayMenu, setDisplayMenu] = useState(false);
  const router = useRouter();
  const [menuOptionsName, setMenuOptionsName] = useState("");

  const toggleDrawer = () => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
  };

  const optionsMenu = [
    { name: "Crear", route: "prototype", icon: <SaveIcon /> },
    { name: "Arbol", route: "show", icon: <ForestIcon /> }
  ]

  const listItems = () => (
    <Box role="presentation" onClick={toggleDrawer} onKeyDown={toggleDrawer}>
      <List>
        {optionsMenu.length > 0 &&
          optionsMenu.map((item) => (
            <ListItem
              key={item.name}
              disablePadding
              onClick={() => {
                setDisplayMenu(false);
                router.push(`/${item.route}`);
                setMenuOptionsName(item.name);
              }}
            >
              <ListItemButton>
                {item.icon}
                <ListItemText primary={item.name} sx={{ paddingLeft: "5px" }} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <MuiAppBar position="static">
          <Toolbar variant="dense">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setDisplayMenu(true)}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h5" component="div" color="#fafafa" minWidth={110}>
              {menuOptionsName}
            </Typography>
          </Toolbar>
        </MuiAppBar>

        <Fragment>
          <SwipeableDrawer
            anchor="left"
            open={displayMenu}
            onClose={() => setDisplayMenu(false)}
            onOpen={() => setDisplayMenu(true)}
          >
            {listItems()}
          </SwipeableDrawer>
        </Fragment>
      </Box>
    </>
  );
}