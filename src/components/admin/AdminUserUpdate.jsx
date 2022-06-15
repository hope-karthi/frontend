import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Button, Fab, Grid, Paper, styled, TextareaAutosize, TextField, Typography,Backdrop, CircularProgress } from '@mui/material'
import { Chalet, MyLocationTwoTone } from '@mui/icons-material';
import { Get_cookies } from '../../sub-components/Cookies';
import { Autocomplete, LoadScript } from '@react-google-maps/api';

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



const AdminUserUpdate = () => {
    const params = useParams();
    const [first_name,setFirst_name] =useState("");
    const [last_name,setLast_name] = useState("");
    const [phone,setPhone] =useState("");
    const [location,setLocation] = useState([]);
    const [date_of_birth,setDate_of_birth] = useState(new Date(Date.now()).toISOString());
    const [ website,setWebsite] = useState("");
    const [designation,setDesignation] = useState("");
    const [short_bio,setShort_bio] = useState("");
    const [bounds,setBounds] = useState(null);
    
    const [loading, setLoading] = useState(false);





    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState({});
    
    useEffect(() => {
        fetch(`${process.env.BACKEND_URL}/user/get-a-user/${params.id}`, {
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${Get_cookies().access_token}`
        }
        })
        .then((res) => {
            if (res.status === 200) {
                return res.json()
            } else if (res.status === 404){
                setError("error")
            }
        })
        .then(
        (json) => {
            setIsLoaded(true);
            setItems(json.result)
            setFirst_name(json.result.first_name)
            setLast_name(json.result.last_name)
            setPhone(json.result.phone)
            if (json.result.location !== null){
              setLocation(json.result.location)
            }
            if (json.result.date_of_birth !== null){
              setDate_of_birth(json.result.date_of_birth)
            }
            console.warn(date_of_birth);
            // setDate_of_birth(json.result.date_of_birth)
            setWebsite(json.result.website)
            setDesignation(json.result.designation)
            setShort_bio(json.result.short_bio)
        }
        )
    }, [])


    function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
        } else {
          x.innerHTML = "Geolocation is not supported by this browser.";
        }
      }
      
    function showPosition(position) {
      setLocation([position.coords.latitude,position.coords.longitude])
      getReverseGeocodingData(position.coords.latitude,position.coords.longitude);
    }
    function getReverseGeocodingData(lat, lng) {
      if(lat !== undefined){
       fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GMAP_ID}`)
       .then(res => res.json())
        .then(
          (json) => {
                if (document.getElementById('location') !== null ) {
                  document.getElementById('location').value=json.results[0].formatted_address;
                }
            }
    )}}
            
    function updateAUser(e){
      e.preventDefault()
      if(first_name === null || last_name === null || phone === null || location === null || date_of_birth === null || website === null || designation === null || short_bio === null){
        window.alert("Fill all Fields ...!")
      }else{  
        setLoading(true)

        const data={
          'first_name': first_name,
          'last_name': last_name,
          'phone': phone,
          'location': location,
          'date_of_birth': date_of_birth.slice(0,10),
          'website': website,
          'designation': designation,
          'short_bio': short_bio
      }
      fetch(`${process.env.BACKEND_URL}/user/update-a-user/${params.id}`, {
          method: 'PUT',
          headers: {
              'accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then((res) => {
        if (res.status === 200) {
          window.location.replace("/admin/users")
        } else {
            setLoading(false)
            window.alert("Something Wrong")
        }
      })
    }}
    
    function onlyAlphabet(id,inputVal,pattern) {
      if(pattern.test(inputVal)){
        document.getElementById(id).value = inputVal;
      }
      else{
        var txt = inputVal.slice(0, -1);
        document.getElementById(id).value = txt;
      }
      
    }

    function autocomplete_address(){
        if (bounds === null){
          return null
        }else{
        setLocation([bounds.getPlace().geometry.location.lat(),bounds.getPlace().geometry.location.lng()])
      }
    }
    if (error) {
      return <div>Error: INVALID ID</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
      
  
    <Grid justifyContent="center">
    <PaperStyled elevation={22} >
        <Grid align='center'>

         <Avatar />

         <Typography variant='h4'>
            Upadte USER
         </Typography>

        </Grid>
        <form  id="otp-generate" onSubmit={(e)=>{}}>
                    <TextField fullWidth id='first-name' type="text" inputProps={{autocomplete: 'off',}} label="First Name" color="secondary"  margin="normal" defaultValue={items.first_name} required onInput={(e) => {onlyAlphabet('first-name',e.target.value,/^[a-zA-Z]+$/);setFirst_name(e.target.value)}}/>
                    <TextField fullWidth id='last-name' type="text" inputProps={{autocomplete: 'off',}} label="Last Name"  color="secondary" margin="normal" defaultValue={items.last_name} required onInput={(e) => {onlyAlphabet('last-name',e.target.value,/^[a-zA-Z]+$/);setLast_name(e.target.value)}}/>
                    <TextField fullWidth id="phone" type="text" inputProps={{autocomplete: 'off',}} label="Mobile Number"  color="secondary" margin="normal" defaultValue={items.phone} required onInput={(e) => {onlyAlphabet('phone',e.target.value,/^[0-9]+$/);setPhone(e.target.value)}}/>
                    
                    
                  
                    
                            <TextField type="text" id='location' label="Location" defaultValue={
                              getReverseGeocodingData(location[0],location[1])
                              }  color="secondary" margin="normal" required style={{ width: "75%"}} /> 
                            <Button onClick={() => getLocation()}>
                                <MyLocationTwoTone style={{margin:"30px",fontSize:"25px"}} sx={{display:{ xs: "none", sm: "inline-block"}}}/><MyLocationTwoTone style={{margin:"0px",marginTop:"25px"}} sx={{display:{ xs: "inline-block", sm: "none"}}}/>
                            </Button>

                    
                    
                    
                    
                    <TextField fullWidth type="date" defaultValue={date_of_birth.slice(0,10)} inputProps={{autocomplete: 'off',}} label="Date of Birth"  color="secondary" margin="normal" required InputLabelProps={{shrink: true,}} onInput={(e) => setDate_of_birth(e.target.value)}/>
                    <TextField fullWidth type="text" defaultValue={items.website} inputProps={{autocomplete: 'off',}} label="Website"  color="secondary" margin="normal" required onInput={(e) => setWebsite(e.target.value)}/>
                    <TextField fullWidth type="text"defaultValue={items.designation} inputProps={{autocomplete: 'off',}} label="Designation"  color="secondary" margin="normal" required onInput={(e) => setDesignation(e.target.value)}/>
                    <TextareaAutosize
                      onInput={(e) => setShort_bio(e.target.value)}
                      aria-label="short bio"
                      defaultValue={items.short_bio}
                      minRows={5}
                      placeholder="Bio"
                      style={{ width: "99%",backgroundColor: "skyblue",marginLeft:"0px" }}
                    />

                    <Typography varient='p' textAlign="center" margin="10px">
                        <Fab  variant="extended" onClick={updateAUser}>
                            <Chalet sx={{ mr: 1 }} />
                            Login
                        </Fab>
                    </Typography>
            </form>
        
        </PaperStyled>

        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    </Grid>
  )
}
}
export default AdminUserUpdate