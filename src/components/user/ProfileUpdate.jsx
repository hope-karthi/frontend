import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Backdrop, Button, CircularProgress, Fab, FormControl, FormControlLabel, FormLabel, Grid, InputAdornment, Paper, Radio, RadioGroup, styled, TextareaAutosize, TextField, Typography } from '@mui/material'
import { Chalet, Close, Delete, MyLocationTwoTone, Upload } from '@mui/icons-material';
import { Get_cookies } from '../../sub-components/Cookies';
import { Autocomplete, LoadScript } from '@react-google-maps/api';
import EditIcon from '@mui/icons-material/Edit';

const PaperStyled = styled(Paper)(({ theme }) => ({
    padding: "30px 20px",
    width: 500,
    backgroundColor: "skyblue",
    margin: "80px auto",
    [theme.breakpoints.down("sm")]: {
        padding: "15px 10px",
        width: 300,
        margin: "40px auto"
    }
}));



const ProfileUpdate = () => {
    const params = useParams();
    const hiddenFileInput = React.useRef(null);

    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [profile_picture, setProfile_picture] = useState(null);
    const [old_pic, setOld_pic] = useState(null);
    const [delete_pic, setDelete_pic] = useState(false);
    const [address, setAddress] = useState("");
    const [date_of_birth, setDate_of_birth] = useState(new Date(Date.now()).toISOString());
    const [website, setWebsite] = useState("");
    const [designation, setDesignation] = useState("");
    const [company, setCompany] = useState("");
    const [short_bio, setShort_bio] = useState("");
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
                } else if (res.status === 404) {
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
                    setAddress(json.result.address)
                    setGender(json.result.gender)
                    if (json.result.date_of_birth !== null) {
                        setDate_of_birth(json.result.date_of_birth)
                        setWebsite(json.result.website.slice(7,))
                    }
                    setCompany(json.result.company)
                    setDesignation(json.result.designation)
                    setShort_bio(json.result.short_bio)
                    setOld_pic(json.result.profile_picture)
                }
            )
    }, [])


    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
    }

    function showPosition(position) {
        getReverseGeocodingData(position.coords.latitude, position.coords.longitude)
    }
    function getReverseGeocodingData(lat, lng) {
        if (lat !== undefined) {
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GMAP_ID}`)
                .then(res => res.json())
                .then(
                    (json) => {
                        if (document.getElementById('address') !== null) {
                            document.getElementById('address').value = json.results[2].formatted_address;
                        }
                    }
                )
        }
    }

    function updateAUser(e) {
        console.warn(website);
        console.warn(items.profile_picture);
        console.warn(profile_picture);
        setLoading(true)
        e.preventDefault()
        const form = new FormData();
        form.append('gender', gender);
        form.append('short_bio',  short_bio);
        form.append('date_of_birth', date_of_birth.slice(0,10));
        form.append('phone', phone);
        form.append('last_name', last_name);
        form.append('address', address);
        form.append('designation', designation);
        form.append('first_name', first_name);
        form.append('website', 'http://'+website);
        form.append('email', items.email);
        form.append('company', company);
        if (profile_picture !== null) {
            form.append('files', profile_picture);
        }else if(old_pic !== null){
            form.append('old_profile', items.profile_picture);
        }
        fetch(`${process.env.BACKEND_URL}/user/update-a-user`, {
            method: 'PUT',

            body: form
        })

            .then((res) => {
                if (res.status === 200) {
                    window.location.replace(`/profile/${params.id}`)
                } else {
                    setLoading(false)
                    window.alert("Something Wrong")
                }
            })
            
    }

    function onlyAlphabet(id, inputVal, pattern) {
        if (pattern.test(inputVal)) {
            document.getElementById(id).value = inputVal;
        }
        else {
            var txt = inputVal.slice(0, -1);
            document.getElementById(id).value = txt;
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


                        <Typography variant='h4'>
                            Upadte USER
                        </Typography>

                    </Grid>
                    <form id="otp-generate" onSubmit={updateAUser}>
                        <Grid align='center'>
                            <input ref={hiddenFileInput} type="file" style={{ display: "none" }}
                                accept='.jpeg, .png, .jpg'
                                onInput={(e) => {
                                    setProfile_picture(e.target.files[0])
                                    var reader = new FileReader();
                                    var url = reader.readAsDataURL(e.target.files[0]);

                                    reader.onloadend = function (e) {
                                        setOld_pic(reader.result)
                                        setDelete_pic(true)
                                    }
                                }}
                            />
                            <Avatar
                                src={(delete_pic) ? old_pic : items.profile_picture}
                                sx={{ width: 70, height: 70 }}
                                />
                                {
                                    (!delete_pic) ?
                                        <Fab onClick={(e) => { hiddenFileInput.current.click(); }} color="secondary" title="Upload image" sx={{ width: 30, height: 10, marginLeft: "15px" }}>
                                            <Upload sx={{ width: 40, height: 20 }} />
                                        </Fab> :
                                        <Fab onClick={(e) => { setDelete_pic(false);setProfile_picture(null) }} color="secondary" title="Remove" sx={{ width: 30, height: 10,  marginLeft: "15px" }}>
                                            <Close sx={{ width: 40, height: 20 }} />
                                        </Fab>
                                }
                            <Fab onClick={(e) => { setDelete_pic(true);setOld_pic(null);setProfile_picture(null) }} color="secondary" sx={{ width: 30, height: 10,  marginLeft: "15px" }}>
                                <Delete sx={{ width: 40, height: 20 }} />
                            </Fab> 
                        </Grid>
                        <TextField fullWidth type="text" label="Email ID" disabled color="secondary" margin="normal" defaultValue={items.email} />
                        <TextField fullWidth id='first-name' type="text" inputProps={{ autocomplete: 'off', }} label="First Name" color="secondary" margin="normal" defaultValue={items.first_name} required onInput={(e) => { onlyAlphabet('first-name', e.target.value, /^[a-zA-Z]+$/); setFirst_name(e.target.value) }} />
                        <TextField fullWidth id='last-name' type="text" inputProps={{ autocomplete: 'off', }} label="Last Name" color="secondary" margin="normal" defaultValue={items.last_name} required onInput={(e) => { onlyAlphabet('last-name', e.target.value, /^[a-zA-Z]+$/); setLast_name(e.target.value) }} />

                        

                        <FormControl>
                            <FormLabel>Gender</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-radio-buttons-group-label"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="female" control={<Radio />} label="Female" />
                                <FormControlLabel value="male" control={<Radio />} label="Male" />
                                <FormControlLabel value="other" control={<Radio />} label="Other" />
                            </RadioGroup>
                        </FormControl>


                        <TextField fullWidth id="phone" type="text" inputProps={{ autocomplete: 'off', }} label="Mobile Number" color="secondary" margin="normal" defaultValue={items.phone} required onInput={(e) => { onlyAlphabet('phone', e.target.value, /^[0-9]+$/); setPhone(e.target.value) }} />




                        <TextField
                            type="text"
                            id='address'
                            label="Address"
                            InputLabelProps={{ shrink: true, }}
                            defaultValue={address}
                            color="secondary" margin="normal" required style={{ width: "75%" }}
                        />
                        <Button title='Current Location' onClick={() => getLocation()}>
                            <MyLocationTwoTone style={{ margin: "30px", fontSize: "25px" }} sx={{ display: { xs: "none", sm: "inline-block" } }} /><MyLocationTwoTone style={{ margin: "0px", marginTop: "25px" }} sx={{ display: { xs: "inline-block", sm: "none" } }} />
                        </Button>





                        <TextField fullWidth type="date" defaultValue={date_of_birth.slice(0, 10)} inputProps={{ autocomplete: 'off', }} label="Date of Birth" color="secondary" margin="normal" required InputLabelProps={{ shrink: true, }} onInput={(e) => setDate_of_birth(e.target.value)} />
                        <TextField fullWidth type="text" defaultValue={website} inputProps={{ autocomplete: 'off', }}  
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        https://
                                    </InputAdornment>
                                ),
                            }} label="Website" color="secondary" margin="normal" required onInput={(e) => setWebsite(e.target.value)} />
                        <TextField fullWidth type="text" defaultValue={items.designation} inputProps={{ autocomplete: 'off', }} label="Designation" color="secondary" margin="normal" required onInput={(e) => setDesignation(e.target.value)} />
                        <TextField fullWidth type="text" defaultValue={items.company} inputProps={{ autocomplete: 'off', }} label="Company" color="secondary" margin="normal" required onInput={(e) => setCompany(e.target.value)} />
                        <TextareaAutosize
                            onInput={(e) => setShort_bio(e.target.value)}
                            aria-label="short bio"
                            defaultValue={items.short_bio}
                            minRows={5}
                            placeholder="Bio"
                            style={{ width: "99%", maxWidth: "99%", backgroundColor: "skyblue", marginLeft: "0px" }}
                        />

                        <Typography varient='p' textAlign="center" margin="10px">
                            <Fab variant="extended" onClick={updateAUser}>
                                <Chalet sx={{ mr: 1 }} />
                                Update
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
export default ProfileUpdate