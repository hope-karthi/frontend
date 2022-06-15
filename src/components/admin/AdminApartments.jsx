import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, Stack } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { Get_cookies } from '../../sub-components/Cookies';
import AdminLeftbar from './AdminLeftbar'
import EditIcon from '@mui/icons-material/Edit';
import { Add, Delete } from '@mui/icons-material';

const AdminApartments = () => {
  const [delete_popup, setDelete_popup] = useState(false);
  const [select_id,setSelect_id] = useState(null);

  const delete_apartment = (id) => {
    fetch(`${process.env.BACKEND_URL}/aparment-sale/delete/${id}`, {
      method: 'DELETE',
      headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${Get_cookies().access_token}`
      }
      })
      .then((res) => {
          if (res.status === 200) {
              window.location.reload()
          } else{
              window.alert("SOMETHING WENT WRONG !!!")
          }
      })
  }
  const columns = React.useMemo(
    () => [
      { field: 'id', type: 'string', width: 10 },
      { field: 'TITLE', type: 'string', width: 150 },
      { field: 'AREA', type: 'float', width: 130 },
      { field: 'RATE', type: 'float', width: 120 },
      { field: 'PRICE', type: 'float', width: 200 },
      { field: 'TYPE', type: 'string', width: 200 },
      {
        field: 'edit',
        type: 'actions',
        width: 30,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            href={`/admin/apartment/update/${params.row.object_id}`}
          />
        ],
      },
      {
        field: 'delete',
        type: 'actions',
        width: 30,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<Delete />}
            label="Edit"
            onClick={()=>{setSelect_id({"id":params.row.object_id,"title":params.row.TITLE});setDelete_popup(true);}}
          />
        ],
      },
    ]);


  function Feed() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);


    useEffect(() => {
      fetch(`${process.env.BACKEND_URL}/aparment-sale/get-all`, {
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
                id: i + 1,
                TITLE: element.title,
                AREA: element.chargable_area,
                RATE: element.rate_per_sqft,
                PRICE: element.chargable_area * element.rate_per_sqft,
                TYPE: element.apartment_types,

                object_id: element.id,
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
      <Box flex={4} p={2}>

        <Fab variant="extended" href='/admin/apartments/create'>
          <Add /> Add
        </Fab>
        <Feed />
      </Box>











      {
        (select_id)?
        <Dialog
        open={delete_popup}
        onClose={(e) => setDelete_popup(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure want to Delete this "{select_id.title}" Apartment ?
        </DialogTitle>
        <DialogActions>
          <Button onClick={(e) => setDelete_popup(false)}>Cancel</Button>
          <Button onClick={(e) => delete_apartment(select_id.id)} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      :null
      }
    </Stack>
  )
}

export default AdminApartments