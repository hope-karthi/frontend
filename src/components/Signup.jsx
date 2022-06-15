import { Google, Navigation } from '@mui/icons-material';
import { Alert, AlertTitle, Avatar, Box, Button, Container, Fab, Grid, Paper, TextField, Typography } from '@mui/material'
import { styled } from '@mui/system';
import React, { useEffect, useState } from 'react'
import { Set_cookies } from '../sub-components/Cookies';
import ReCAPTCHA from 'react-google-recaptcha';
import GoogleLogin from 'react-google-login';

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
        throw Error(response.statusText);
    }
  }

const Signup = () => {
    const [signup1,setSignup1] =useState("block");
    const [signup2,setSignup2] =useState("none");
    
    const [first_name,setFirst_name] =useState("");
    const [last_name,setLast_name] =useState("");
    const [mail_id,setMail_id] = useState("");
    const [password,setPassword] = useState("");
    const [c_password,setC_passwiord] =useState("");
    const [otp,setOtp] = useState("");
    const [ip,setIp] =useState(null);
    
    const recaptchaRef = React.createRef();


    useEffect(()=>{
        fetch('https://geolocation-db.com/json/')
        .then((e)=>e.json())
        .then((json)=>setIp(json.IPv4))
    },[])



    const otp_generate = (e) => {
        e.preventDefault();
        const recaptchaValue = recaptchaRef.current.getValue();
        if (!recaptchaValue){
            window.alert("Complete the captcha..!")
        }else{
            fetch(`${process.env.BACKEND_URL}/user/send-otp-mail?email=${encodeURIComponent(mail_id)}`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/x-www-form-urlencoded'
                }
            })
            .then((res)=>{
                if (res.status >= 200 && res.status <= 299) {
                    setSignup1("none");
                    setSignup2("block");
                }else if(res.status === 404){
                    window.alert("User already signup")
                }
            })
        }
    }
    
    const otp_check =(e)=>{
        e.preventDefault();
        if (password === c_password) {
            fetch(`${process.env.BACKEND_URL}/user/check-otp-mail`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'first_name': first_name,
                    'last_name': last_name,
                    'email': mail_id,
                    'password': password,
                    'user_ip':ip.toString(),
                    'otp': otp
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
                        'email': mail_id,
                        'token': json.access_token
                    })
                });
                window.location.replace("/")
            })
            .catch((error) => {
                
                window.alert("CHECK MAIL_ID")
                console.error('Error:', error);
            });
        }else{
            window.alert("Password Mismatch")
        }
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
                    Signup
                </Typography>

               </Grid>

               <form onSubmit={otp_generate} style={{display: signup1}} id="otp-generate">
                    <TextField fullWidth label="First Name" placeholder="Enter your First name" color="secondary" margin="normal" onChange={(e)=>setFirst_name(e.target.value)} required/>
                    <TextField fullWidth label="Last Name" placeholder="Enter your Last name" color="secondary" margin="normal" onChange={(e)=>setLast_name(e.target.value)} required/>
                    <TextField fullWidth type="email" label="Email Id" placeholder="Enter your Email-ID" color="secondary"  margin="normal" onChange={(e)=>setMail_id(e.target.value)} required/>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.CAPTCHA_ID}
                        theme="dark"
                    />
                    <Typography varient='p' textAlign="center" margin="10px">
                        <Fab type="submit" variant="extended" >
                            <Navigation sx={{ mr: 1 }} />
                            Get OTP
                        </Fab>
                    </Typography>
                    <Typography varient='p' textAlign="center" margin="10px" color="secondary">
                        or already registered 
                        <Button href="/login">Login Here</Button>
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
                </form>
                
                <form onSubmit={otp_check} style={{display: signup2}} id="otp-checker">
                    <Typography varient='p' textAlign="center" margin="15px">
                        <Alert severity="success" sx={{ m:2 }}>
                            <AlertTitle>OTP send Success</AlertTitle>
                            OTP expire within <strong>10 min!</strong>
                        </Alert>

                        <TextField fullWidth type="number" label="OTP" color="secondary"  margin="normal" onChange={(e)=>setOtp(e.target.value)} required/> 
                        <TextField fullWidth type="password" label="Password"  color="secondary" margin="normal" onChange={(e)=>setPassword(e.target.value)} required/>
                        <TextField fullWidth id="c-password" type="password" label="Confirm Password" color="secondary" margin="normal" onChange={(e)=>setC_passwiord(e.target.value)} required/>
                        <Button type="submit" variant="contained" color="secondary" sx={{ ml: 1,mt:2 }}>
                            Submit
                        </Button> 
                    </Typography>
                    <Typography varient='p' textAlign="center" margin="10px" color="secondary">
                        or already registered 
                        <Button href="/login">Login Here</Button>
                    </Typography>
               </form>
           </PaperStyled>
       </Grid>
  )
}

export default Signup