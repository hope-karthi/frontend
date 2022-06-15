import { Home } from '@mui/icons-material'
import { Box, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'

const Sidebar = () => {
  return (
    <Box 
        flex={1} 
        p={2}
        sx={{
            display: { xs: "none", sm: "block"}
        }} 
    >
        <ListItem disablePadding>
            <ListItemButton component="a" href="#">
                <ListItemIcon>
                    <Home />
                </ListItemIcon>
                <ListItemText primary="Home" />
            </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
            <ListItemButton component="a" href="#">
                <ListItemIcon>
                    <Home />
                </ListItemIcon>
                <ListItemText primary="Home" />
            </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
            <ListItemButton component="a" href="#">
                <ListItemIcon>
                    <Home />
                </ListItemIcon>
                <ListItemText primary="Home" />
            </ListItemButton>
        </ListItem>
    </Box>
  )
}

export default Sidebar