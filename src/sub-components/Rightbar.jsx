import { Box, Slider, Typography, Button } from '@mui/material'
import React, { useState } from 'react'


function getListData(data,key){
  const value=[];
  for (let index = 0; index < data.length; index++) {value.push(data[index][key])}
  return value.sort(function(a, b){return a-b})
}

function filteredList(data,key,range){
  const value=[];
  for (let index = 0; index < data.length; index++) {
    const element = data[index][key];
    if (range[0]<=element && element<=range[1]) {
      value.push(data[index])
    }    
  }
  return value
}

function range_set(newValue,activeThumb,key,keyFunc){
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

const Rightbar = (fromHome) => {
  const area_list=getListData(fromHome.filtering_details,"chargable_area");
  const rate_list=getListData(fromHome.filtering_details,"rate_per_sqft");

  
  const [area_length, setArea_length] =useState([area_list[0],area_list[area_list.length-1]]);
  const [rate_length,setRate_length] = useState([rate_list[0],rate_list[rate_list.length-1]])
  const [price_length,setPrice_length] = useState([20,100])
  const [type_length,setType_length] = useState([20,100])
  

// ################################ Slider Functions ###################################
  const areaSliderHandle = (event, newValue, activeThumb) => {range_set(newValue,activeThumb,area_length,setArea_length)};
  const rateSliderHandle = (event, newValue, activeThumb) => {range_set(newValue,activeThumb,rate_length,setRate_length)};
  const priceSliderHandle = (event, newValue, activeThumb) => {range_set(newValue,activeThumb,price_length,setPrice_length)};
  const typeSliderHandle = (event, newValue, activeThumb) => {range_set(newValue,activeThumb,type_length,setType_length)};
// ########################################################################################

if(fromHome.map_open){
    return (
      <Box 
          flex={3} 
          p={2}
          sx={{
              display: { xs: "none", sm: "block"},
          }} 
      >

        <h1>Filters</h1>
{/* ###############################      Area      ############################# */}
          <Typography variant="h4" color="error" gutterBottom component="div">
            Area
          </Typography>
            <Slider
            style={{marginBottom:"10px"}}
            min={area_list[0]}
            max={area_list[area_list.length-1]}
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
          </Typography>
            <Slider
            style={{marginBottom:"10px"}}
            min={rate_list[0]}
            max={rate_list[rate_list.length-1]}
            getAriaLabel={() => 'Minimum distance'}
            value={rate_length}
            onChange={rateSliderHandle}
            valueLabelDisplay="auto"
            disableSwap
          />
{/* ############################################################################## */}

{/* ###############################      Price      ############################# */}
<Typography variant="h4" color="error" gutterBottom component="div">
            Price
          </Typography>
            <Slider
            style={{marginBottom:"10px"}}
            min={10}
            max={200}
            getAriaLabel={() => 'Minimum distance'}
            value={price_length}
            onChange={priceSliderHandle}
            valueLabelDisplay="auto"
            disableSwap
          />
{/* ############################################################################## */}

{/* ###############################      Type      ############################# */}
<Typography variant="h4" color="error" gutterBottom component="div">
            Type
          </Typography>
            <Slider
            style={{marginBottom:"10px"}}
            min={10}
            max={200}
            getAriaLabel={() => 'Minimum distance'}
            value={type_length}
            onChange={typeSliderHandle}
            valueLabelDisplay="auto"
            disableSwap
          />
{/* ############################################################################## */}

          <Button onClick={(e)=>{
            // const area=filteredList(fromHome.filtering_details,"chargable_area",area_length);
            // const rate=filteredList(area,"rate_per_sqft",rate_length);
            // fromHome.setMarker_details(rate);
          }}
          >Submit</Button>
      </Box>
    )
  }
}


export default Rightbar