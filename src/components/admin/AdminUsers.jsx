import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, Fab, Menu, MenuItem, Stack, TextareaAutosize, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AdminLeftbar from './AdminLeftbar'
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { Get_cookies } from '../../sub-components/Cookies';
import { Chalet, Close, LocationCityRounded, MyLocationTwoTone } from '@mui/icons-material';
import { Autocomplete, LoadScript } from '@react-google-maps/api';




const AdminUsers = () => {
  const columns = React.useMemo(
    () => [
      { field: 'id', type: 'string',width: 10},
      { field: 'EMAIL', type: 'string', width: 200},
      { field: 'NAME', type: 'string' ,width: 150},
      { field: 'MOBILE', type: 'string', width: 130 },
      { field: 'GAUTH', type: 'boolean', width: 120 },
      {
        field: 'actions',
        type: 'actions',
        width: 30,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            href={`/admin/users/update/${params.row.object_id}`}
          />
        ],
      },
    ]);


    function Feed () {
      const [error, setError] = useState(null);
      const [isLoaded, setIsLoaded] = useState(false);
      const [items, setItems] = useState([]);
      useEffect(() => {
        fetch(`${process.env.BACKEND_URL}/user/get-all-users`, {
          headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${Get_cookies().access_token}`
          }
        })
        .then(res => res.json())
        .then(
          (json) => {
            setIsLoaded(true);
            const datas = [];
            for (let i = 0; i < json.result.length; i++) {
              const element = json.result[i];
              datas.push({
                id: i+1,
                EMAIL: element.email,
                NAME: element.first_name+" "+element.last_name,
                MOBILE: element.phone,
                GAUTH: element.google_oauth,

                object_id : element.id,
                first_name : element.first_name,
                last_name : element.last_name,
                date_of_birth : element.date_of_birth,
                short_bio : element.short_bio,
                location : element.location,
                website : element.website,
                designation : element.designation,
                listing : element.listing
              })
            }
            setItems(datas)
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
      }, [])
 
    
      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
        return (
          <div style={{ height: 870, width: '100%' }}>
            <DataGrid columns={columns} rows={items} components={{ Toolbar: GridToolbar }}/>
          </div>
        );
      }
    
    }














  return (
    <Stack direction="row" spacing={2} justifyContent="space-between">
        <AdminLeftbar />
        <Box  flex={4} p={2}>
                   
          <Feed />
        </Box>


    </Stack>
  )
}

export default AdminUsers