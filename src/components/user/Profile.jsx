import { Box, Fab, Stack, Typography } from '@mui/material'
import { styled } from '@mui/system';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Get_cookies } from '../../sub-components/Cookies'
import EditIcon from '@mui/icons-material/Edit';
import { Chalet } from '@mui/icons-material';

const Profile_picture=styled("img")(({theme}) =>({
    width:"100px",
    height:"100px",
    border:"5px solid #000",
    [theme.breakpoints.up("sm")] : {
        width:"100px",
        height:"100px",
        border:"05px solid #000",
    }
}));

const Profile = () => {
    const params = useParams();
    const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch(`${process.env.BACKEND_URL}/user/get-a-user/${params.id}`, {
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${Get_cookies().access_token}`
        }
        })
      .then(res => {
          if (res.status === 200){
              return res.json()
          }else if(res.status == 404){
            setError(true);  
            return res.json()
          }

      })
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        }
      )
  }, [])
  if (error) {
    return <div>Error: {items.detail}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      
    <>
    <Stack 
        direction="row" 
        justifyContent="center"
        sx={{
            marginTop:{xs:"9%",sm:"5%"}
        }}>
        <Profile_picture
            src={items.result.profile_picture}
            />
        <Fab color="secondary" title="Edit Profile" href={`/profile/update/${params.id}`} aria-label="edit" sx={{position:"absolute",marginLeft:{xs:"29%",sm:"8%"},marginTop:{xs:"18%",sm:"5%"}}}>
            <EditIcon />
        </Fab>
    </Stack>
    <Stack 
        direction="row" 
        spacing={2} 
        justifyContent="space-between"
        sx={{
            marginTop:{xs:"9%",sm:"5%"}
        }}
    >
        <Box
            flex={1} 
            p={2}
        >
        </Box>
        <Box
            flex={4} p={2} 
        >
            <h2>
                {items.result.first_name} {items.result.last_name}
            </h2>
            <Typography varient='p' margin="10px">
                            <Fab variant="extended" color='success' href='/profile/apartments/create'>
                                <Chalet sx={{ mr: 1 }} />
                                Add Appartment
                            </Fab>
                        </Typography>
        </Box>
    </Stack>
    </>
    
  )
}
}

export default Profile