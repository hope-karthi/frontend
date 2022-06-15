import { Autocomplete, GoogleMap, LoadScript, useJsApiLoader } from '@react-google-maps/api'
import { Box, Stack } from '@mui/material'
import React from 'react'
import AdminLeftbar from './AdminLeftbar'

const AdminDashBoard = () => {
  
  







  return (
    <Stack direction="row" spacing={2} justifyContent="space-between">
        <AdminLeftbar />
        <Box  flex={4} p={2}>
          
              Chennai
        </Box>
    </Stack>
  
  )
}

export default AdminDashBoard




