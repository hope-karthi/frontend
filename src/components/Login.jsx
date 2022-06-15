import { Chalet, Google } from '@mui/icons-material';
import { Avatar, Button, Fab, Grid, Paper, styled, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import GoogleLogin from 'react-google-login';
import { Set_cookies } from '../sub-components/Cookies';

const  PaperStyled = styled(Paper)(({theme}) =>({
    padding: "30px 20px",
    width: 500,
    backgroundColor:"skyblue",
    margin: "80px auto",
    [theme.breakpoints.down("sm")] : {
        padding: "15px 10px",
        width: 300,
        margin: "40px auto"
    }
}));

function CheckError(response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
        console.warn(response.statusText);
        throw Error(response.statusText);
    }
  }

const Login = () => {
    const [login_mail_id,setLogin_mail_id] = useState("");
    const [login_password,setLogin_password] = useState("");
    const [ip,setIp] =useState(null);

    useEffect(()=>{
        fetch('https://geolocation-db.com/json/')
        .then((e)=>e.json())
        .then((json)=>setIp(json.IPv4))
    },[])

    const login_submit = (e) =>{
        e.preventDefault()
        fetch(`${process.env.BACKEND_URL}/user/login`, {
            method: 'POST',
            headers: {
                'accept': 'application/json'
            },
            body: new URLSearchParams({
                'grant_type': '',
                'username': login_mail_id,
                'password': login_password,
                'scope': '',
                'client_id': '',
                'client_secret': ''
        })
        })
        .then(CheckError)
        .then((json) =>{
            Set_cookies(json);
            fetch(`${process.env.BACKEND_URL}/user/session`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'ip_address': localStorage.getItem('user_ip'),
                    'email': login_mail_id,
                    'token': json.access_token
                })
            });
            window.location.replace("/")
        })
        .catch((error) => {
            window.alert("CHECK MAIL_ID")
            console.error('Error:', error);
        });
    }
    const gauth_response = (e) => {
        fetch(`${process.env.BACKEND_URL}/user/gauth`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'first_name': e.profileObj.givenName,
                'last_name': e.profileObj.familyName,
                'email': e.profileObj.email,
                'profile_picture': e.profileObj.imageUrl,
                'user_ip':ip
            })
        })
        .then(CheckError)
        .then((json) =>{
            Set_cookies(json);
            fetch(`${process.env.BACKEND_URL}/user/session`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'ip_address': localStorage.getItem('user_ip'),
                    'email': e.profileObj.email,
                    'token': json.access_token
                })
            });
            window.location.replace("/")
        })
        .catch((error) => {
            window.alert("CHECK MAIL_ID")
            console.error('Error:', error);
        });
    }
  return (
    <Grid justifyContent="center">
    <PaperStyled elevation={22} >
        <Grid align='center'>
         
         <Avatar />

         <Typography variant='h4'>
            Login
         </Typography>

        </Grid>
        <form  id="otp-generate" onSubmit={login_submit}>
            <TextField fullWidth type="email" label="Email Id" placeholder="Enter your Email-ID" color="secondary"  margin="normal" onChange={(e)=>setLogin_mail_id(e.target.value)} required/>
            <TextField fullWidth type="password" label="Password"  color="secondary" margin="normal" onChange={(e)=>setLogin_password(e.target.value)} required/>
            <Typography varient='p' textAlign="center" margin="10px">
                <Fab type="submit" variant="extended" >
                    <Chalet sx={{ mr: 1 }} />
                    Login
                </Fab>
            </Typography>
        </form>
        <Typography varient='p' textAlign="center" margin="10px" color="secondary">
            or create an Account
            <Button href="/signup">Here</Button>
        </Typography>
        <Typography varient='p' textAlign="center" margin="10px" color="secondary">
            or 
        </Typography>
        <Typography varient='p' textAlign="center" margin="10px" color="secondary">
            <GoogleLogin
            clientId={process.env.GAUTH_ID}
            render={renderProps => (
                <Button onClick={renderProps.onClick} disabled={renderProps.disabled}>
                <Google  />
                </Button>
              )}
            buttonText="Login"
            onSuccess={gauth_response}
            cookiePolicy={'single_host_origin'}
            />
 
        </Typography>
    </PaperStyled>
</Grid>
  )
}

export default Login