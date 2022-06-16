import { Alert, Box, Button, Checkbox, Drawer, Fab, FormControlLabel, FormGroup, Popover, Slider, Snackbar, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Autocomplete, GoogleMap, InfoBox, LoadScript, Marker, OverlayView, useLoadScript } from '@react-google-maps/api'
import { Close, Remove } from '@mui/icons-material';

function getListData(data, key) {
  const value = [];
  for (let index = 0; index < data.length; index++) { value.push(data[index][key]) }
  return value.sort(function (a, b) { return a - b })
}

function filteredList(data, key, range) {
  const value = [];
  for (let index = 0; index < data.length; index++) {
    const element = data[index][key];
    if (range[0] <= element && element <= range[1]) {
      value.push(data[index])
    }
  }
  return value
}

function filteredChoice(data, key, choices) {
  const value = [];
  for (let index = 0; index < data.length; index++) {
    const element = data[index][key];
    if (choices.indexOf(element) !== -1) {
      value.push(data[index])
    }
  }
  return value
}


function range_set(newValue, activeThumb, key, keyFunc) {
  const minDistance = 10;
  if (!Array.isArray(newValue)) {
    return;
  }

  if (activeThumb === 0) {
    keyFunc([Math.min(newValue[0], key[1] - minDistance), key[1]]);
  } else {
    keyFunc([key[0], Math.max(newValue[1], key[0] + minDistance)]);
  }
}

const containerStyle = {
  width: '100%',
  height: '400px'
};


const options = {
  componentRestrictions: { country: "in" },
  strictBounds: false,
};
const Feed = (fromHome) => {

  const [map_open, setMap_open] = useState(false);
  const [map, setMap] = useState(null)
  const [autocomplete, setautocomplete] = useState(null);
  const [center, setCenter] = useState(null);

  const [marker_values, setMarker_values] = useState([]);
  const [search_location, setSearch_location] = useState([]);



  const [area_list, setArea_list] = useState(null);
  const [rate_list, setRate_list] = useState(null);
  const [studio, setStudio] = useState(null)
  const [BHK2, setBHK2] = useState(null)
  const [BHK3, setBHK3] = useState(null)
  const [BHK4, setBHK4] = useState(null)
  const [filtering_details, setFiltering_details] = useState(null);

  const [area_length, setArea_length] = useState(null);
  const [rate_length, setRate_length] = useState(null)

  const [info_overlay, setInfo_overlay] = useState(null);


  const [drawer_open,setDrawer_open] = useState(false);
  
  let libRef = React.useRef(['places'])

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.GMAP_ID,
    libraries: libRef.current,
  });

  const map_query = () => {
    if (
      search_location[0] - 0.5 <= map.getBounds().Ab.h &&
      search_location[0] + 0.5 >= map.getBounds().Ab.j &&
      search_location[1] - 0.5 <= map.getBounds().Ua.h &&
      search_location[1] + 0.5 >= map.getBounds().Ua.j
    ) {
      setCenter(map.getCenter())

      fetch(`${process.env.BACKEND_URL}/map-query/?n=${map.getBounds().Ab.h}&s=${map.getBounds().Ab.j}&e=${map.getBounds().Ua.h}&w=${map.getBounds().Ua.j}`, {
        headers: {
          'accept': 'application/json'
        }
      })
        .then((res) => res.json())
        .then((json) => {
          setFiltering_details(json);
          setMarker_values(json)
          const areaTemp = getListData(json, "chargable_area")
          const rateTemp = getListData(json, "rate_per_sqft")
          setArea_list(areaTemp)
          setRate_list(rateTemp)
          // areaTemp.length == 0 ?  []:areaTemp
          setArea_length(areaTemp.length == 0 ? [0, 100] : [areaTemp[0], areaTemp[areaTemp.length - 1]])
          setRate_length(rateTemp.length == 0 ? [0, 100] : [rateTemp[0], rateTemp[rateTemp.length - 1]])
        })
    } else {
      document.getElementById('details').innerHTML = "Please search the location"
      map.setCenter({ lat: search_location[0], lng: search_location[1] })
      map.setZoom(10)
    }
  }

  // const area_list=getListData(fromHome.filtering_details,"chargable_area");


  const map_markers = () => {
    if (marker_values === []) { return null }
    else {
      return (<>
        {
          marker_values.map((item, index) => {
            return (<React.Fragment><Marker onClick={(e) => { setInfo_overlay(item) }} key={index} position={{ lat: item.location_marker[0], lng: item.location_marker[1] }} /></React.Fragment>)
          })
        }
      </>)
    }
  }

  // ################################ Slider Functions ###################################
  const areaSliderHandle = (event, newValue, activeThumb) => { range_set(newValue, activeThumb, area_length, setArea_length) };
  const rateSliderHandle = (event, newValue, activeThumb) => { range_set(newValue, activeThumb, rate_length, setRate_length) };
  // ########################################################################################





  return (
    <React.Fragment>

      <Box flex={5} p={4} >

        <h4 id="details"></h4>
        {
          (map_open)?
          <Button onClick={(e)=> setDrawer_open(true)} sx={{display: { xs: "block", sm: "none" },}}>Filters</Button>
          : null
        }
        {
          (isLoaded) ?
            <React.Fragment>
              <Autocomplete
                options={options}
                onLoad={(e) => setautocomplete(e)}
                onPlaceChanged={(e) => {
                  if (autocomplete !== null && autocomplete.getPlace().geometry !== undefined) {
                    document.getElementById("auto-complete-id").value=""
                    setMap_open(true);
                    fromHome.setMap_open(true);
                    setCenter([autocomplete.getPlace().geometry.viewport.Ab.h, autocomplete.getPlace().geometry.viewport.Ua.h])
                    setSearch_location([autocomplete.getPlace().geometry.viewport.Ab.h, autocomplete.getPlace().geometry.viewport.Ua.h])
                  }
                }
                }
              >
                <TextField fullWidth color="secondary" margin="normal" id="auto-complete-id"/>
              </Autocomplete>
              {
                (map_open) ?

                  <GoogleMap
                    id='google-map'
                    options={{ disableDefaultUI: true, zoomControl: true, }}
                    onDragStart={(e) => document.getElementById('details').innerText = ""}
                    onLoad={(e) => setMap(e)}
                    onIdle={(e) => {
                      if (map !== null) { map_query() }
                    }}
                    mapContainerStyle={containerStyle}
                    center={center ? { lat: center[0], lng: center[1] } : null}
                    zoom={13}
                  >
                    {map_markers()}





                  </GoogleMap>
                  : null
              }
            </React.Fragment>
            : <h2>Loadind</h2>
        }




        {
          (info_overlay) ?
            <h3 id="details" style={{display: { xs: "none", sm: "block" },}}>
              Title - {info_overlay.title}<br />
              Rate - {info_overlay.rate_per_sqft}<br />
              Area - {info_overlay.chargable_area}<br />
              Price - {info_overlay.rate_per_sqft * info_overlay.chargable_area}
            </h3>
            : null
        }
        

      </Box>




      {
        (area_list) ?

          <Box
            flex={3}
            p={2}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
          >

            <h1>Filters</h1>
            {/* ###############################      Area      ############################# */}
            <Typography variant="h4" color="error" gutterBottom component="div">
              Area
              <p><TextField value={area_length[0]} onChange={(e) => setArea_length([e.target.value, area_length[area_length.length - 1]])} /> to <TextField value={area_length[area_length.length - 1]} onChange={(e) => setArea_length([area_length[0], e.target.value])} /></p>
            </Typography>
            <Slider
              style={{ marginBottom: "10px" }}
              min={area_list[0]}
              max={area_list[area_list.length - 1]}
              getAriaLabel={() => 'Minimum distance'}
              value={area_length}
              onChange={areaSliderHandle}
              valueLabelDisplay="auto"
              disableSwap
            />
            {/* ############################################################################## */}

            {/* ###############################      Rate per sqft      ############################# */}
            <Typography variant="h4" color="error" gutterBottom component="div">
              Rate per sqft
              <p><TextField value={rate_length[0]} /> to <TextField value={rate_length[rate_length.length - 1]} /></p>
            </Typography>
            <Slider
              style={{ marginBottom: "10px" }}
              min={rate_list[0]}
              max={rate_list[rate_list.length - 1]}
              getAriaLabel={() => 'Minimum distance'}
              value={rate_length}
              onChange={rateSliderHandle}
              valueLabelDisplay="auto"
              disableSwap
            />
            {/* ############################################################################## */}

            {/* #################################Type of Aparment####################### */}
            <Typography variant="h4" color="error" gutterBottom component="div">
              Type
            </Typography>
            <FormGroup>
              <FormControlLabel control={<Checkbox color="error" />} label="Studio" onChange={(e) => { if (studio === null) { setStudio("Studio") } else { setStudio(null) } }} />
              <FormControlLabel control={<Checkbox color="error" />} label="2BHK" onChange={(e) => { if (BHK2 === null) { setBHK2("2BHK") } else { setBHK2(null) } }} />
              <FormControlLabel control={<Checkbox color="error" />} label="3BHK" onChange={(e) => { if (BHK3 === null) { setBHK3("3BHK") } else { setBHK3(null) } }} />
              <FormControlLabel control={<Checkbox color="error" />} label="4BHK" onChange={(e) => { if (BHK4 === null) { setBHK4("4BHK") } else { setBHK4(null) } }} />
            </FormGroup>
            {/* ######################################################################## */}










            <Fab type="submit" variant="extended" color='error'
              onClick={(e) => {
                const area = filteredList(filtering_details, "chargable_area", area_length);
                const rate = filteredList(area, "rate_per_sqft", rate_length);
                const type = filteredChoice(rate, "apartment_types", [studio, BHK2, BHK3, BHK4])
                setMarker_values(type);
              }}
            >
              Submit
            </Fab>
          </Box> : null
      }








      <Drawer
        anchor='right'
        open={drawer_open}
        onClose={(e)=>setDrawer_open(false)}
      >
        {
        (area_list) ?

          <Box
            flex={3}
            p={2}
            sx={{ width: "300px" }}
          role="presentation"
          >

            <h1>Filters <Fab onClick={(e)=>setDrawer_open(false)} color="error"> <Close/> </Fab></h1>
            {/* ###############################      Area      ############################# */}
            <Typography variant="h4" color="error" gutterBottom component="div">
              Area
              <p><TextField value={area_length[0]} onChange={(e) => setArea_length([e.target.value, area_length[area_length.length - 1]])} /> to <TextField value={area_length[area_length.length - 1]} onChange={(e) => setArea_length([area_length[0], e.target.value])} /></p>
            </Typography>
            <Slider
              style={{ marginBottom: "10px" }}
              min={area_list[0]}
              max={area_list[area_list.length - 1]}
              getAriaLabel={() => 'Minimum distance'}
              value={area_length}
              onChange={areaSliderHandle}
              valueLabelDisplay="auto"
              disableSwap
            />
            {/* ############################################################################## */}

            {/* ###############################      Rate per sqft      ############################# */}
            <Typography variant="h4" color="error" gutterBottom component="div">
              Rate per sqft
              <p><TextField value={rate_length[0]} /> to <TextField value={rate_length[rate_length.length - 1]} /></p>
            </Typography>
            <Slider
              style={{ marginBottom: "10px" }}
              min={rate_list[0]}
              max={rate_list[rate_list.length - 1]}
              getAriaLabel={() => 'Minimum distance'}
              value={rate_length}
              onChange={rateSliderHandle}
              valueLabelDisplay="auto"
              disableSwap
            />
            {/* ############################################################################## */}

            {/* #################################Type of Aparment####################### */}
            <Typography variant="h4" color="error" gutterBottom component="div">
              Type
            </Typography>
            <FormGroup>
              <FormControlLabel control={<Checkbox checked={studio} color="error" />} label="Studio" onChange={(e) => { if (studio === null) { setStudio("Studio") } else { setStudio(null) } }} />
              <FormControlLabel control={<Checkbox checked={BHK2} color="error" />} label="2BHK" onChange={(e) => { if (BHK2 === null) { setBHK2("2BHK") } else { setBHK2(null) } }} />
              <FormControlLabel control={<Checkbox checked={BHK3} color="error" />} label="3BHK" onChange={(e) => { if (BHK3 === null) { setBHK3("3BHK") } else { setBHK3(null) } }} />
              <FormControlLabel control={<Checkbox checked={BHK4} color="error" />} label="4BHK" onChange={(e) => { if (BHK4 === null) { setBHK4("4BHK") } else { setBHK4(null) } }} />
            </FormGroup>
            {/* ######################################################################## */}










            <Fab type="submit" variant="extended" color='error'
              onClick={(e) => {
                const area = filteredList(filtering_details, "chargable_area", area_length);
                const rate = filteredList(area, "rate_per_sqft", rate_length);
                const type = filteredChoice(rate, "apartment_types", [studio, BHK2, BHK3, BHK4])
                setMarker_values(type);
                setDrawer_open(false)
              }}
            >
              Submit
            </Fab>
          </Box> : null
      }
      </Drawer>
    </React.Fragment>

  )
}

export default Feed