import { Add, Close, Remove } from '@mui/icons-material';
import { Alert, Avatar, Button, Checkbox, Backdrop, FormControl, FormControlLabel, FormLabel, Grid, InputAdornment, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Radio, RadioGroup, Select, Snackbar, Stack, styled, TextareaAutosize, TextField, Typography, CircularProgress } from '@mui/material'
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react'
import { Get_cookies } from '../../sub-components/Cookies';
import { Autocomplete, GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useParams } from 'react-router-dom';

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

function getDifference(array1, array2) {
    const temp = array1;
    for (let i = 0; i < array1.length; i++) {
        const element1 = array1[i].name;
        for (let j = 0; j < array2.length; j++) {
            const element2 = array2[j].name;
            if (element1 === element2) {
                delete temp[i]
            }
        }
    }
    return temp
}

const amenities_tags = [
    "Lifts",
    "24 x 7 Security",
    "Fire Safety",
    "24 x 7 Water Supply",
    "Vastu Compliant",
    "Rain Water Harvesting",
    "Grocery Shop",
    "Sewage Treatment",
    "24 x 7 Power Backup",
    "Children's Play area",
    "Club House",
    "GYM",
    "Gated Community",
    "CCTV Camera",
    "Visitors Parking",
    "Maintainance Staff",
    "Piped Gas",
    "Party Hall",
    "Swimming Pool",
    "Earthquake Resistant",
    "Security Cabin"
]

const options = {
    componentRestrictions: { country: "in" },
    fields: ["address_components", "geometry", "icon", "name"],
    strictBounds: false,
    types: ["establishment"],
};

function onlyAlphabet(id, inputVal, pattern) {



    if (pattern.test(inputVal)) {
        document.getElementById(id).value = inputVal;
    }
    else {
        var txt = inputVal.slice(0, -1);
        document.getElementById(id).value = txt;
    }

}

const ApartmentUpdate = () => {
    const params = useParams();

    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    const [uploadeimagelist,] = useState([]);
    const [, setTempload] = useState();
    const [imageuploaded, setImageuploaded] = useState(false);
    const [autocomplete, setautocomplete] = useState(null);
    const [old_images_showing, setold_images_showing] = useState(null);
    const [old_images_uploaded, setold_images_uploaded] = useState([]);



    const [title, settitle] = useState(null);
    const [short_description, setshort_description] = useState(null);
    const [images, setimages] = useState(null);
    const [possession, setpossession] = useState(false);
    const [project_Name, setproject_Name] = useState(null);
    const [direction_facing, setdirection_facing] = useState(null);
    const [age_of_property, setage_of_property] = useState(null);
    const [location_marker, setlocation_marker] = useState(null);
    const [chargable_area, setchargable_area] = useState(null);
    const [carpet_area, setcarpet_area] = useState(null);
    const [price, setprice] = useState(null);
    const [rate_per_sqft, setrate_per_sqft] = useState(null);
    const [registration_charges, setregistration_charges] = useState(false);
    const [taxes, settaxes] = useState(false);
    const [apartment_types, setapartment_types] = useState(null);
    const [no_of_floors, setno_of_floors] = useState(null);
    const [floor, setfloor] = useState(null);
    const [bicycle_parking, setbicycle_parking] = useState(false);
    const [no_bicycle_parking, setno_bicycle_parking] = useState(null);
    const [car_parking, setcar_parking] = useState(false);
    const [no_car_parking, setno_car_parking] = useState(null);
    const [resale, setresale] = useState(false);
    const [amenities, setamenities] = useState([]);
    const [address, setaddress] = useState(null);
    const [furnishing, setfurnishing] = useState(null);
    const [rera_id, setrera_id] = useState(null);
    const [corner, setcorner] = useState(false);
    const [bank_loan, setbank_loan] = useState(false);
    const [list_of_bank, setlist_of_bank] = useState(null);
    const [negotiable, setnegotiable] = useState(false);
    const [property_overview, setproperty_overview] = useState(null);


    const [bedrooms, setbedrooms] = useState(0);
    const [livingrooms, setlivingrooms] = useState(0);
    const [hall, sethall] = useState(0);
    const [kitchen, setkitchen] = useState(0);
    const [bathrooms, setbathrooms] = useState(0);
    const [balcony, setbalcony] = useState(0);
    const [dining, setdining] = useState(0);


    const [show_error, setShow_error] = useState(false)

    function getReverseGeocodingData(lat, lng) {
        if (lat !== undefined) {
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GMAP_ID}`)
                .then(res => res.json())
                .then(
                    (json) => {
                        //   if (document.getElementById('address') !== null ) {
                        setaddress(json.results[0].formatted_address)
                        document.getElementById('address').value = json.results[0].formatted_address;
                        //   }
                    }
                )
        }
    }

    const check_values = (e) => {
        if ( title == null || carpet_area == null || rate_per_sqft == null || short_description == null || direction_facing == null || age_of_property == null || location_marker == null || carpet_area == null || apartment_types == null || no_of_floors == null || floor == null || address == null || furnishing == null || rera_id == null || property_overview == null) {
            setShow_error(true)
        } else if (bicycle_parking === true && no_bicycle_parking === null) {
            setShow_error(true)
        } else if (car_parking === true && no_car_parking === null) {
            setShow_error(true)
        } else {
            setLoading(true)
            submit()
        }
    }

    useEffect(() => {
        fetch(`${process.env.BACKEND_URL}/aparment-sale/get/${params.id}`, {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${Get_cookies().access_token}`
            }
        })
            .then((res) => res.json())
            .then((json) => {
                setLoaded(true)
                settitle(json.result.title)
                setshort_description(json.result.short_description)

                setold_images_showing(json.result.images)

                setpossession(json.result.posseession)
                setproject_Name(json.result.project_name)
                setdirection_facing(json.result.direction_facing)
                setage_of_property(json.result.age_of_property)
                setchargable_area(json.result.chargable_area)
                setcarpet_area(json.result.carpet_area)
                setrate_per_sqft(json.result.rate_per_sqft)
                setregistration_charges(json.result.registration_charges)
                settaxes(json.result.taxes)
                setapartment_types(json.result.apartment_types)
                setno_of_floors(json.result.no_of_floors)
                setfloor(json.result.floor_of_appartment)
                setbicycle_parking(json.result.two_wheeler_parking.state)
                setno_bicycle_parking(json.result.two_wheeler_parking.no_of_parking)
                setcar_parking(json.result.car_parking.state)
                setno_car_parking(json.result.car_parking.no_of_parking)
                setresale(json.result.resale)
                const temp_amenities_values = []
                for (let i = 0; i < amenities_tags.length; i++) {
                    const element = amenities_tags[i];
                    if (json.result.amenities[element]) {
                        temp_amenities_values.push(element)
                    }
                }
                setamenities(temp_amenities_values)
                setaddress(json.result.address)
                setfurnishing(json.result.furnishing_types)
                setrera_id(json.result.rera_id)
                setcorner(json.result.corner)
                setbank_loan(json.result.bank_loan)
                setnegotiable(json.result.negotiable)
                setproperty_overview(json.result.property_overview)

                setbedrooms(json.result.BHK.bedrooms)
                setlivingrooms(json.result.BHK.livingrooms)
                sethall(json.result.BHK.hall)
                setkitchen(json.result.BHK.kitchen)
                setbathrooms(json.result.BHK.bathrooms)
                setbalcony(json.result.BHK.balcony)
                setdining(json.result.BHK.dining)
                setTimeout((e) => setlocation_marker(json.result.location_marker), 3000);

            })
    }, [])


    const submit = (e) => {

        const form = new FormData
        if (images !== null){
            for (let index = 0; index < images.length; index++) {
                const element = images[index];
                form.append('files', element);
        }}

        fetch(`${process.env.BACKEND_URL}/aparment-sale/uploade-images`, {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${Get_cookies().access_token}`
            },
            method: "POST",
            body: form
        })
            .then((res) => res.json())
            .then((json) => {
                const aminities_temp = {}
                for (let index = 0; index < amenities_tags.length; index++) {
                    const element = amenities_tags[index];
        
                    if (amenities.indexOf(element) !== -1){
                        aminities_temp[element] = true
                    }else{
                        aminities_temp[element] = false
                    }
                }
                const images_temp =[];
                if (json[0] === undefined){
                    images_temp.concat(getDifference(old_images_showing,old_images_uploaded))
                }else{
                    images_temp.concat(getDifference(old_images_showing,old_images_uploaded),json)
                }
                
                fetch(`${process.env.BACKEND_URL}/aparment-sale/update/${params.id}`, {
                    method: 'PUT',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${Get_cookies().access_token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'title': title,
                        'short_description': short_description,
                        'posseession': possession,
                        'project_name': project_Name,
                        'direction_facing': direction_facing,
                        'age_of_property': age_of_property,
                        'location_marker': location_marker,
                        'chargable_area': chargable_area,
                        'carpet_area': carpet_area,
                        'rate_per_sqft': rate_per_sqft,
                        'registration_charges': registration_charges,
                        'taxes': taxes,
                        'apartment_types': apartment_types,
                        'BHK': { "bedrooms": bedrooms, "livingrooms": livingrooms, "hall": hall, "kitchen": kitchen, "bathrooms": bathrooms, "balcony": balcony, "dining": dining },
                        'no_of_floors': no_of_floors,
                        'floor_of_appartment': floor,
                        'two_wheeler_parking': { "state": bicycle_parking, "no_of_parking": no_bicycle_parking },
                        'car_parking': { "state": car_parking, "no_of_parking": no_car_parking },
                        'resale': resale,
                        'amenities': aminities_temp,
                        'address': address,
                        'furnishing_types': furnishing,
                        'rera_id': rera_id,
                        'corner': corner,
                        'bank_loan': bank_loan,
                        // list of bank
                        'list_of_bank': [
                            'string'
                        ],
                        'negotiable': negotiable,
                        'property_overview': property_overview,
                        'images': images_temp
                    })
                })
                .then((res) => {
                    if (res.status === 200) {
                        window.location.replace("/admin/apartments")
                    } else {
                        setLoading(false)
                        window.alert("Something Wrong")
                    }
                })
            })
    }


    if (!loaded) {
        return (<h1>Loading</h1>)
    } else {
        return (
            <Grid justifyContent="center">
                <PaperStyled elevation={22} >
                    <Grid align='center'>
                        <Typography variant='h4'>
                            Create Apartments
                        </Typography>
                    </Grid>

                    <form >
                        {/* ############################# TITLE ######################## */}
                        <TextField
                            value={title}
                            fullWidth
                            id='title'
                            type="text"
                            inputProps={{ autocomplete: 'off', }}
                            label="Title"
                            color="secondary"
                            margin="normal"
                            required
                            onInput={(e) => {
                                onlyAlphabet('title', e.target.value, /^[a-z A-Z]+$/);
                                settitle(e.target.value)
                            }} />
                        {/* ############################################################### */}


                        {/* #################### Short Description ######################## */}
                        <TextField
                            value={short_description}
                            fullWidth
                            id='short-description'
                            type="text"
                            inputProps={{ autocomplete: 'off', }}
                            label="Short Description"
                            color="secondary"
                            margin="normal"
                            required
                            onInput={(e) => {
                                onlyAlphabet('short-description', e.target.value, /^[a-z A-Z]+$/);
                                setshort_description(e.target.value)
                            }} />
                        {/* ############################################################### */}

                        {/* ############################# Image ######################## */}
                        <TextField
                            fullWidth
                            variant="standard"
                            id='image'
                            type="file"
                            inputProps={{ multiple: true }}
                            label="Image"
                            InputLabelProps={{ shrink: true, }}
                            color="secondary"
                            margin="normal"
                            required
                            onInput={(e) => {
                                for (let index = 0; index < e.target.files.length; index++) {

                                    const element = e.target.files[index];
                                    uploadeimagelist.push(element)
                                    setTempload(element.name)
                                };
                                setimages(uploadeimagelist);
                                setImageuploaded(true);
                            }} />
                        {
                            (old_images_showing !== null) ?
                                old_images_showing.map((item, index) => {
                                    return (
                                        <Box id={item.name} ><Avatar src={item.url} key={index}></Avatar>
                                            {item.name}
                                            <Button onClick={(e) => {
                                                document.getElementById(item.name).style.display = "none"
                                                old_images_uploaded.push(item)
                                            }}>
                                                <Close />
                                            </Button></Box>
                                    )
                                }) : null
                        }
                        {/* {old_images_showing} */}


                        {
                            (imageuploaded) ?
                                <>
                                    {uploadeimagelist.map((item) => {
                                        return <>{item.name}<br /></>
                                    })}
                                </> : null
                        }

                        {/* ############################################################### */}

                        {/* ############################# Possession ######################## */}
                        <Box style={{ marginTop: "3%" }}>
                            <FormControl>
                                <FormLabel>Possession</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    value={possession}
                                    onChange={(e) => setpossession(e.target.value)}
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                    <FormControlLabel value={false} control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                        {/* ############################################################### */}


                        {/* ############################# Project Name ######################## */}
                        <TextField
                            value={project_Name}
                            fullWidth
                            id='project-name'
                            type="text"
                            inputProps={{ autocomplete: 'off', }}
                            label="Project Name"
                            color="secondary"
                            margin="normal"
                            required
                            onInput={(e) => {
                                onlyAlphabet('project-name', e.target.value, /^[a-z A-Z]+$/);
                                setproject_Name(e.target.value);
                            }} />

                        {/* ############################################################### */}

                        {/* ############################# Direction Facing ######################## */}
                        <FormControl fullWidth style={{ marginTop: "3%" }}>
                            <InputLabel id="direction-facing">Direction Facing</InputLabel>
                            <Select
                                value={direction_facing}
                                label="Direction Facing"
                                onChange={(e) => setdirection_facing(e.target.value)}
                            >
                                <MenuItem value={"North"}>North</MenuItem>
                                <MenuItem value={"South"}>South</MenuItem>
                                <MenuItem value={"West"}>West</MenuItem>
                                <MenuItem value={"East"}>East</MenuItem>
                                <MenuItem value={"NorthWest"}>NorthWest</MenuItem>
                                <MenuItem value={"NorthEast"}>NorthEast</MenuItem>
                                <MenuItem value={"SouthWest"}>SouthWest</MenuItem>
                                <MenuItem value={"SouthEast"}>SouthEast</MenuItem>
                            </Select>
                        </FormControl>

                        {/* ############################################################### */}

                        {/* ############################# Age of Property ######################## */}
                        <TextField
                            value={age_of_property}
                            fullWidth
                            id='project-name'
                            type="number"
                            inputProps={{ autocomplete: 'off', min: 1 }}
                            label="Age of Property"
                            color="secondary"
                            margin="normal"
                            required
                            onInput={(e) => setage_of_property(e.target.value)}
                        />

                        {/* ############################################################### */}

                        {/* ############################# Location ######################## */}

                        <LoadScript
                            googleMapsApiKey={process.env.GMAP_ID}
                            libraries={["places"]}
                        >

                            <Autocomplete

                                options={options}
                                onLoad={(e) => setautocomplete(e)}
                                onPlaceChanged={(e) => {
                                    document.getElementById("auto-complete").value = ""
                                    if (autocomplete !== null) {
                                        if (autocomplete.getPlace().geometry === undefined) {
                                            window.location.reload()
                                        }
                                        setlocation_marker([autocomplete.getPlace().geometry.viewport.Ab.h, autocomplete.getPlace().geometry.viewport.Ua.h])
                                        getReverseGeocodingData(autocomplete.getPlace().geometry.viewport.Ab.h, autocomplete.getPlace().geometry.viewport.Ua.h)
                                    }
                                }
                                }

                            >
                                <TextField
                                    fullWidth
                                    id="auto-complete"
                                    color="secondary"
                                    margin="normal"
                                />
                            </Autocomplete>
                            <GoogleMap
                                options={{ streetViewControl: false, disableDefaultUI: true }}
                                mapContainerStyle={{ width: '100%', height: "200px" }}
                                center={location_marker ? { lat: location_marker[0], lng: location_marker[1] } : { lat: -3.745, lng: -38.523 }}
                                zoom={16}
                            >
                                {
                                    (location_marker) ?

                                        <Marker
                                            draggable
                                            onDragEnd={(e) => { setlocation_marker([e.latLng.lat(), e.latLng.lng()]); getReverseGeocodingData(e.latLng.lat(), e.latLng.lng()) }}
                                            position={{ lat: location_marker[0], lng: location_marker[1] }}
                                        /> : null
                                }
                            </GoogleMap>
                        </LoadScript>
                        {/* ############################################################### */}

                        {/* ############################# Address ######################## */}
                        <TextField
                            value={address}
                            fullWidth
                            id='address'
                            type="text"
                            inputProps={{ autocomplete: 'off', }}
                            label="Address"
                            color="secondary"
                            margin="normal"
                            required
                            onInput={(e) => {
                                onlyAlphabet('address', e.target.value, /^[()a-z A-Z0-9,.+-]+$/);
                                setaddress(e.target.value)
                            }} />
                        {/* ############################################################### */}

                        {/* ############################# Chargable Area ######################## */}
                        <TextField
                            value={chargable_area}
                            fullWidth
                            id='chargable-area'
                            type="number"
                            inputProps={{ autocomplete: 'off', step: '.01', min: 1 }}
                            label="Chargable Area"
                            color="secondary"
                            margin="normal"
                            required
                            onInput={(e) => {
                                let temp = e.target.value;
                                if (temp.indexOf(".") !== -1) {
                                    if (temp.length - 2 !== temp.indexOf(".")) {
                                        document.getElementById('chargable-area').value = temp.slice(0, temp.indexOf(".") + 3)
                                        temp = temp.slice(0, temp.indexOf(".") + 3)
                                    }
                                }
                                setchargable_area(temp)
                            }} />


                        {/* ############################################################### */}

                        {/* ############################# Carpet Area ######################## */}
                        <TextField
                            value={carpet_area}
                            fullWidth
                            id='carpet-area'
                            type="number"
                            inputProps={{ autocomplete: 'off', step: '.01', min: 1 }}
                            label="Carpet Area"
                            color="secondary"
                            margin="normal"
                            required
                            onInput={(e) => {
                                let temp = e.target.value;
                                if (temp.indexOf(".") !== -1) {
                                    if (temp.length - 2 !== temp.indexOf(".")) {
                                        document.getElementById('carpet-area').value = temp.slice(0, temp.indexOf(".") + 3)
                                        temp = temp.slice(0, temp.indexOf(".") + 3)
                                    }
                                }
                                setcarpet_area(temp)

                            }} />


                        {/* ############################################################### */}


                        {/* ############################# Rate Per Sqft ######################## */}
                        <TextField
                            value={rate_per_sqft}
                            fullWidth
                            id='rate-per-sqft'
                            type="text"
                            inputProps={{ autocomplete: 'off', }}
                            label="Rate Per Sqft"
                            color="secondary"
                            margin="normal"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment>
                                        SQFT
                                    </InputAdornment>
                                )
                            }}
                            required
                            onInput={(e) => {
                                onlyAlphabet('rate-per-sqft', e.target.value, /^[0-9]+$/);
                                setrate_per_sqft(e.target.value)
                            }} />


                        {/* ############################################################### */}

                        {/* ############################# Price ######################## */}
                        <TextField
                            disabled
                            fullWidth
                            value={rate_per_sqft * chargable_area}
                            id='price'
                            type="text"
                            label="Price"
                            color="secondary"
                            margin="normal"
                        />


                        {/* ############################################################### */}

                        {/* ############################# Registration Charges  ######################## */}
                        <Box style={{ marginTop: "3%" }}>
                            <FormControl>
                                <FormLabel>Registration Charge</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    value={registration_charges}
                                    onChange={(e) => setregistration_charges(e.target.value)}
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                    <FormControlLabel value={false} control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                        {/* ############################################################### */}

                        {/* ############################# Taxes ######################## */}
                        <Box style={{ marginTop: "3%" }}>
                            <FormControl>
                                <FormLabel>Taxes</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    value={taxes}
                                    onChange={(e) => settaxes(e.target.value)}
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                    <FormControlLabel value={false} control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Box>

                        {/* ############################################################### */}


                        {/* ############################# Apartments Types ######################## */}
                        <FormControl fullWidth style={{ marginTop: "3%" }}>
                            <InputLabel id="apartment-types">Apartment Types</InputLabel>
                            <Select
                                value={apartment_types}
                                label="Apartment Types"
                                onChange={(e) => setapartment_types(e.target.value)}
                            >
                                <MenuItem value={"Studio"}>Studio</MenuItem>
                                <MenuItem value={"2BHK"}>2BHK</MenuItem>
                                <MenuItem value={"3BHK"}>3BHK</MenuItem>
                                <MenuItem value={"4BHK"}>4BHK</MenuItem>
                            </Select>
                        </FormControl>


                        {/* ############################################################### */}


                        {/* ############################# BHK ######################## */}
                        <Stack direction="row" justifyContent="space-between" style={{ marginTop: "3%" }}>
                            <FormLabel >Bed Rooms</FormLabel>
                            <Box >
                                <Button onClick={(e) => setbedrooms(bedrooms + 1)}><Add /></Button>
                                {bedrooms}
                                <Button onClick={(e) => setbedrooms((bedrooms === 0) ? 0 : bedrooms - 1)}><Remove /></Button>
                            </Box>
                        </Stack>
                        <hr />
                        <Stack direction="row" justifyContent="space-between" style={{ marginTop: "3%" }}>
                            <FormLabel>Living Rooms</FormLabel>
                            <Box>
                                <Button onClick={(e) => setlivingrooms(livingrooms + 1)}><Add /></Button>
                                {livingrooms}
                                <Button onClick={(e) => setlivingrooms((livingrooms === 0) ? 0 : livingrooms - 1)}><Remove /></Button>
                            </Box>
                        </Stack>
                        <hr />
                        <Stack direction="row" justifyContent="space-between" style={{ marginTop: "3%" }}>
                            <FormLabel>Hall</FormLabel>
                            <Box>
                                <Button onClick={(e) => sethall(hall + 1)}><Add /></Button>
                                {hall}
                                <Button onClick={(e) => sethall((hall === 0) ? 0 : hall - 1)}><Remove /></Button>
                            </Box>
                        </Stack>
                        <hr />
                        <Stack direction="row" justifyContent="space-between" style={{ marginTop: "3%" }}>
                            <FormLabel>Kitchen</FormLabel>
                            <Box>
                                <Button onClick={(e) => setkitchen(kitchen + 1)}><Add /></Button>
                                {kitchen}
                                <Button onClick={(e) => setkitchen((kitchen === 0) ? 0 : kitchen - 1)}><Remove /></Button>
                            </Box>
                        </Stack>
                        <hr />
                        <Stack direction="row" justifyContent="space-between" style={{ marginTop: "3%" }}>
                            <FormLabel>Bath Rooms</FormLabel>
                            <Box>
                                <Button onClick={(e) => setbathrooms(bathrooms + 1)}><Add /></Button>
                                {bathrooms}
                                <Button onClick={(e) => setbathrooms((bathrooms === 0) ? 0 : bathrooms - 1)}><Remove /></Button>
                            </Box>
                        </Stack>
                        <hr />
                        <Stack direction="row" justifyContent="space-between" style={{ marginTop: "3%" }}>
                            <FormLabel>Balcony</FormLabel>
                            <Box>
                                <Button onClick={(e) => setbalcony(balcony + 1)}><Add /></Button>
                                {balcony}
                                <Button onClick={(e) => setbalcony((balcony === 0) ? 0 : balcony - 1)}><Remove /></Button>
                            </Box>
                        </Stack>
                        <hr />
                        <Stack direction="row" justifyContent="space-between" style={{ marginTop: "3%" }}>
                            <FormLabel>Dining</FormLabel>
                            <Box>
                                <Button onClick={(e) => setdining(dining + 1)}><Add /></Button>
                                {dining}
                                <Button onClick={(e) => setdining((dining === 0) ? 0 : dining - 1)}><Remove /></Button>
                            </Box>
                        </Stack>
                        <hr />






                        {/* ############################################################### */}

                        {/* ############################# No of Floors ######################## */}
                        <TextField
                            value={no_of_floors}
                            fullWidth
                            id='no-of-floors'
                            type="number"
                            inputProps={{ autocomplete: 'off', min: 1 }}
                            label="No of Floors"
                            color="secondary"
                            margin="normal"
                            required
                            onInput={(e) => setno_of_floors(e.target.value)} />


                        {/* ############################################################### */}

                        {/* ############################# Floor ######################## */}
                        <TextField
                            value={floor}
                            fullWidth
                            id='floor'
                            type="number"
                            inputProps={{ autocomplete: 'off' }}
                            label="Floor"
                            color="secondary"
                            margin="normal"
                            required
                            onInput={(e) => setfloor(e.target.value)} />


                        {/* ############################################################### */}


                        {/* ############################# Bicycle-Parking ######################## */}
                        <Box style={{ marginTop: "3%" }}>
                            <FormControl>
                                <FormLabel>Bicycle Parking</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    value={bicycle_parking}
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value={true} control={<Radio onClick={(e) => setbicycle_parking(true)} />} label="Yes" />
                                    <FormControlLabel value={false} control={<Radio onClick={(e) => setbicycle_parking(false)} />} label="No" />
                                    {
                                        (!bicycle_parking) ?
                                            null :
                                            <TextField value={no_bicycle_parking} style={{ marginLeft: "0%", maxWidth: "150px" }} type="number" color="secondary" label="No of parking" onInput={(e) => setno_bicycle_parking(e.target.value)} inputProps={{ autocomplete: 'off', min: 1 }} />
                                    }
                                </RadioGroup>

                            </FormControl>
                        </Box>
                        {/* ############################################################### */}

                        {/* ############################# Car-Parking ######################## */}
                        <Box style={{ marginTop: "3%" }}>
                            <FormControl>
                                <FormLabel>Car Parking</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    value={car_parking}
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value={true} control={<Radio onClick={(e) => setcar_parking(true)} />} label="Yes" />
                                    <FormControlLabel value={false} control={<Radio onClick={(e) => setcar_parking(false)} />} label="No" />
                                    {
                                        (!car_parking) ?
                                            null :
                                            <TextField value={no_car_parking} style={{ marginLeft: "0%", maxWidth: "150px" }} type="number" color="secondary" label="No of parking" onInput={(e) => setno_car_parking(e.target.value)} inputProps={{ autocomplete: 'off', min: 1 }} />
                                    }
                                </RadioGroup>

                            </FormControl>
                        </Box>
                        {/* ############################################################### */}


                        {/* ############################# Resale ######################## */}
                        <Box style={{ marginTop: "3%" }}>
                            <FormControl>
                                <FormLabel>Resale</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    value={resale}
                                    onChange={(e) => setresale(e.target.value)}
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                    <FormControlLabel value={false} control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Box>

                        {/* ############################################################### */}





                        {/* ############################# No of Bedrooms / Kichen / Bathrooms ######################## */}
                        <FormControl sx={{ width: "100%" }}>
                            <InputLabel fullWidth id="demo-multiple-checkbox-label">Amenities</InputLabel>
                            <Select

                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={amenities}
                                onChange={
                                    (event) => {
                                        const {
                                            target: { value },
                                        } = event;
                                        window.alert(value)
                                        setamenities(
                                            // On autofill we get a stringified value.
                                            typeof value === 'string' ? value.split(',') : value,
                                        );
                                    }
                                }
                                input={<OutlinedInput label="Tag" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 48 * 4.5 + 8,
                                            width: 250,
                                        },
                                    }
                                }}
                            >
                                {amenities_tags.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={amenities.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* ############################################################### */}




                        {/* ############################# Furnishing type ######################## */}
                        <Box style={{ marginTop: "3%" }}>
                            <FormControl>
                                <FormLabel>Furnishing Type</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    value={furnishing}
                                    onChange={(e) => setfurnishing(e.target.value)}
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value={"Fully-Furnished"} control={<Radio />} label="Fully" />
                                    <FormControlLabel value={"Semi-Furnished"} control={<Radio />} label="Semi" />
                                    <FormControlLabel value={"Un-Furnished"} control={<Radio />} label="Not" />
                                </RadioGroup>
                            </FormControl>
                        </Box>


                        {/* ############################################################### */}

                        {/* ############################# Rera ID ######################## */}
                        <TextField
                            value={rera_id}
                            fullWidth
                            id='rera-id'
                            type="text"
                            inputProps={{ autocomplete: 'off', }}
                            label="RERA ID"
                            color="secondary"
                            margin="normal"
                            required
                            onInput={(e) => {
                                onlyAlphabet('rera-id', e.target.value, /^[0-9 A-Z]+$/);
                                setrera_id(e.target.value)
                            }} />


                        {/* ############################################################### */}


                        {/* ############################# Corner ######################## */}
                        <Box style={{ marginTop: "3%" }}>
                            <FormControl>
                                <FormLabel>Corner</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    value={corner}
                                    onChange={(e) => setcorner(e.target.value)}
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                    <FormControlLabel value={false} control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Box>



                        {/* ############################################################### */}


                        {/* ############################# Bank Loan ######################## */}

                        <Box style={{ marginTop: "3%" }}>
                            <FormControl>
                                <FormLabel>Bank Loan</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    value={bank_loan}
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value={true} control={<Radio onClick={(e) => setbank_loan(true)} />} label="Yes" />
                                    <FormControlLabel value={false} control={<Radio onClick={(e) => setbank_loan(false)} />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Box>

                        {/* ############################################################### */}


                        {/* ############################# List of Banks ######################## */}
                        {
                            (bank_loan) ?
                                <TextField
                                    fullWidth
                                    id='list_of_bank'
                                    type="text"
                                    inputProps={{ autocomplete: 'off', }}
                                    label="Select Bank"
                                    color="secondary"
                                    margin="normal"
                                    required
                                />
                                : null
                        }


                        {/* ############################################################### */}





                        {/* ############################# Negotiable ######################## */}

                        <Box style={{ marginTop: "3%" }}>
                            <FormControl>
                                <FormLabel>Negotiable</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    value={negotiable}
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value={true} control={<Radio onClick={(e) => setnegotiable(true)} />} label="Yes" />
                                    <FormControlLabel value={false} control={<Radio onClick={(e) => setnegotiable(false)} />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Box>

                        {/* ############################################################### */}

                        {/* ############################# Property Over Looking ######################## */}
                        <TextField
                            value={property_overview}
                            fullWidth
                            id='property-over-looking'
                            type="text"
                            inputProps={{ autocomplete: 'off', }}
                            label="Property Over Looking"
                            color="secondary"
                            margin="normal"
                            required
                            onInput={(e) => {
                                onlyAlphabet('property-over-looking', e.target.value, /^[a-z A-Z]+$/);
                                setproperty_overview(e.target.value)
                            }} />


                        {/* ############################################################### */}




                        <Button onClick={check_values}>Submit</Button>

                    </form>
                </PaperStyled>

                <Snackbar open={show_error} autoHideDuration={6000} onClose={() => setShow_error(false)}>
                    <Alert variant="filled" onClose={() => setShow_error(false)} severity="warning" sx={{ width: '100%' }}>
                        Fill All required Fields !!!
                    </Alert>
                </Snackbar>
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

export default ApartmentUpdate