import { Stack } from '@mui/material'
import React, { useState } from 'react'
import Feed from './sub-components/Feed'
import Navbar from './sub-components/Navbar'
import Rightbar from './sub-components/Rightbar'
import Sidebar from './sub-components/Sidebar'



function Home() {
  const [map_open,setMap_open] = useState(false);
  const [filtering_details,setFiltering_details] = useState(null)
  const [marker_details,setMarker_details] = useState([]);

  return (
      <Stack direction="row" spacing={2} justifyContent="space-between">

      <Sidebar />
      <Feed setMap_open={setMap_open} setFiltering_details={setFiltering_details} marker_details={marker_details}/>
      {
        (filtering_details)?
        <Rightbar map_open={map_open} filtering_details={filtering_details} setMarker_details={setMarker_details} />
        :null
      }
      </Stack>
  )
}

export default Home