import {Mail,MenuOutlined,NotificationAdd,PetsOutlined } from '@mui/icons-material'
import {AppBar, Avatar, Badge, Box, Button,InputBase, Link,Menu,MenuItem,Toolbar, Typography } from '@mui/material'
import { styled } from '@mui/system'
import React, { useState } from 'react'
import { Get_cookies } from './Cookies';




const StyledToolbar =styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between"
})

const Search = styled("div") (({theme}) =>({
    backgroundColor: "White",
    padding: "0 10px",
    borderRadius: theme.shape.borderRadius,
    width: "40%"
}));

const Icons = styled(Box)(({theme}) =>({
    display: "none",
    alignItems: "center",
    gap: "20px",
    [theme.breakpoints.up("sm")] : {
        display: "flex"
    }
}));

const  UserBox = styled(Box)(({theme}) =>({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    [theme.breakpoints.up("sm")] : {
        display: "none  "
    }
}));


const Navbar = () => {
    const [usermenu_open,setUsermenu_open] =useState(false);
  return (
    <AppBar position='sticky'>
        <StyledToolbar>
            
            {/* 
                    If screen width more than 600 'Homenow' is show
                    less than 600 Logo is show
            */}
            <Link href="/" underline="none" color="#fff">
                <Typography variant='h4' sx={{display:{ xs: "none", sm: "block"}}}>
                    HomeNow
                </Typography>
                <PetsOutlined sx={{display:{ xs: "block", sm: "none"}}} />
            </Link>


            <Search> <InputBase placeholder='Search ...'/></Search>
            <Icons>
            {
                (Get_cookies() === null)?
                <>
                    <Button variant="contained" color="primary" href="/login">
                        Login
                    </Button>

                    <Button variant="contained" color="primary" href="/signup">
                        Signup
                    </Button>
                </>:
                <>
                     <Badge badgeContent="9+" color="info">
                    <Mail color='red'/>
                </Badge>
                <Badge badgeContent="2+" color="info">
                    <NotificationAdd/>
                </Badge>
                <Avatar 
                src={Get_cookies().profile_picture}
                onClick={e => {setUsermenu_open(true)}}/>
                {/* <img src={Get_cookies().profile_picture} /> */}
                </>
            }
            


               
            </Icons>
            <UserBox onClick={e => {setUsermenu_open(true)}}>
                {
                    (Get_cookies() === null)?
                    null:
                    <Avatar 
                        src={Get_cookies().profile_picture}
                        onClick={e => {setUsermenu_open(true)}}
                    />
                    
                }
                <MenuOutlined />
            </UserBox>
        </StyledToolbar>

{/*             THis menu is pop-up menu, When click then only show             */}
{
    (Get_cookies() === null)?
    
            <Menu 
                        id="user-menu"
                        aria-labelledby="user-menu"
                        open={usermenu_open}
                        onClose={e => {setUsermenu_open(false)}}
                        anchorOrigin={{
                            vertical : "top",
                            horizontal : "right"
                        }}
                        transformOrigin={{
                            vertical : "top",
                            horizontal : "right"
                        }}
                    >
                <MenuItem>
                    <Button variant="contained" color="primary" href="/signup">
                        Signup
                    </Button>
                </MenuItem>
                <MenuItem>
                    <Button variant="contained" color="primary" href="/login">
                        Login
                    </Button>
                </MenuItem>
                </Menu>
                :
                <Menu 
                        id="user-menu"
                        aria-labelledby="user-menu"
                        open={usermenu_open}
                        onClose={e => {setUsermenu_open(false)}}
                        anchorOrigin={{
                            vertical : "top",
                            horizontal : "right"
                        }}
                        transformOrigin={{
                            vertical : "top",
                            horizontal : "right"
                        }}
                    >
                    {(Get_cookies().user_type === "super_user")?
                    <MenuItem>
                        <Button variant="contained" color="primary" href='/admin/dashboard'>
                            Dash-board
                        </Button>
                    </MenuItem>:
                    <MenuItem>
                        <Button variant="contained" color="primary" href={`/profile/${Get_cookies().id}`}>
                            Profile
                        </Button>
                    </MenuItem>}
                    <MenuItem>
                        <Button variant="contained" color="primary" onClick={()=>{localStorage.removeItem("solution");window.location.reload()}}>
                            Logout
                        </Button>
                    </MenuItem>
                </Menu>
            }   
{/* ######################################################################### */}


    </AppBar>

  )
}

export default Navbar