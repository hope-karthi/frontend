import Home from "./Home"
import Signup from "./components/Signup"
import AdminDashBoard from "./components/admin/AdminDashBoard"
import Navbar from "./sub-components/Navbar"
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import Login from "./components/Login"
import { Get_cookies, Set_cookies } from "./sub-components/Cookies"
import AdminUsers from "./components/admin/AdminUsers"
import AdminApartments from "./components/admin/AdminApartments"
import AdminUserUpdate from "./components/admin/AdminUserUpdate"
import Profile from "./components/user/Profile"
import ProfileUpdate from "./components/user/ProfileUpdate"
import ApartmentsCreate from "./components/Apartments/ApartmentCreate"
import { useState } from "react"
import ApartmentUpdate from "./components/Apartments/ApartmentUpdate"


function ip_address(){
  fetch(`https://api.ipdata.co?api-key=${process.env.IP_API}`)
  .then((res)=>res.json())
  .then((json)=> {
    localStorage.setItem('user_ip', json.ip);
    fetch(`${process.env.BACKEND_URL}/user/check-session/${json.ip}`)
    .then((res)=> res.json())
    .then((json) => {
      if(json.result === true){Set_cookies(json)}
    })
  })
}
if (localStorage.getItem('user_ip') === null){
  ip_address()
  
}
console.warn(localStorage.getItem('user_ip'));

function user_in_logout(value) {
  if (Get_cookies() === null){
    return value
  }else {
    return <Home />
  }}
function user_in_login(value) {
  if (Get_cookies() !== null){
    return value
  }else{
    return <Home />
  }}
function superuser_in_login(value) {
  if (Get_cookies() !== null){
    if (Get_cookies().user_type === "super_user") {
      return value
    }
  }else{
    return <Home />
  }
}
function App() {
    
    
    
  return (
    <div>
      hii
      {/* <Navbar />
      
      <Router>
        <Routes>
        
        
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/signup" element={user_in_logout(<Signup/>)} />
        <Route exact path="/login" element={user_in_logout(<Login/>)} />


        <Route exact path="/admin/dashboard" element={superuser_in_login(<AdminDashBoard />)} />
        <Route exact path="/admin/users" element={superuser_in_login(<AdminUsers />)} />
        <Route exact path="/admin/users/update/:id" element={superuser_in_login(<AdminUserUpdate />)} />
        
        <Route exact path="/admin/apartments" element={superuser_in_login(<AdminApartments />)} />
        <Route exact path="/admin/apartments/create" element={superuser_in_login(<ApartmentsCreate />)} />
        <Route exact path="/admin/apartment/update/:id" element={superuser_in_login(<ApartmentUpdate />)} />
        
        <Route exact path="/profile/:id" element={user_in_login(<Profile/>)} />
        <Route exact path="/profile/update/:id" element={user_in_login(<ProfileUpdate/>)} />

        <Route exact path="/profile/apartments/create" element={user_in_login(<ApartmentsCreate />)} />


        <Route path='*' element={<h1 style={{textAlign:"center",marginTop:"20%"}}>404 -Page not Found</h1>} />
        </Routes>
      </Router> */}
    </div>
  )
}

export default App