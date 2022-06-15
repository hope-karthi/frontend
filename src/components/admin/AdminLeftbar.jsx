import { Dashboard, Home, VerifiedUser } from '@mui/icons-material'
import { Box, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'



  function AdminLeftbar () {
  
    document.addEventListener('readystatechange', event => { 
      if (event.target.readyState === "complete") {
        var Attribute =document.getElementById(`${window.location.pathname}`); 
        Attribute.setAttribute("class","MuiListItemButton-root MuiListItemButton-gutters Mui-disabled MuiButtonBase-root Mui-disabled css-h4pi96-MuiButtonBase-root-MuiListItemButton-root");
      }
    });
  
  return (
    <Box 
        flex={1} 
        p={2}
        sx={{
            display: { xs: "none", sm: "block"}
        }} 
    >
        <ListItem disablePadding >
            <ListItemButton component="a" href="/admin/dashboard" id="/admin/dashboard" >
                <ListItemIcon>
                    <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Dash-Board" />
            </ListItemButton>
        </ListItem>
        <ListItem disablePadding >
            <ListItemButton component="a" href="/admin/users" id="/admin/users" >
                <ListItemIcon>
                    <VerifiedUser />
                </ListItemIcon>
                <ListItemText primary="User" />
            </ListItemButton>
        </ListItem>
              
        <ListItem disablePadding>
            <ListItemButton component="a" href="/admin/apartments" id="/admin/apartments" >
                <ListItemIcon>
                    <Home />
                </ListItemIcon>
                <ListItemText primary="Apartments" />
            </ListItemButton>
        </ListItem>
        
    </Box>
  )
}

export default AdminLeftbar