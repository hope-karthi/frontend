import { ThemeProvider } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { theme } from './theme';
import ReCAPTCHA from "react-google-recaptcha";


const root = ReactDOM.createRoot(document.getElementById('root'));
const dev_user = () => {
  const dev=localStorage.getItem("dev_user")
  if (!dev) {
    return true
  } else {
    return false    
  }
}
const set_dev_user =() => {
  const name = document.getElementById("name").value
  const pass = document.getElementById("password").value
  if (process.env.dev_name == name && process.env.dev_pass == pass){
    localStorage.setItem('dev_user',"okay")
  }
}
root.render(
  <React.StrictMode>
    {
      (dev_user())?
      <form onSubmit={set_dev_user}>
        Username : <input type="text" id="name"/><br/>
        Password : <input type="password" id="password"/><br/>
        <button type='submit' >Submit</button>
      </form>
      
      :

    <ThemeProvider theme={theme}>
  <App/></ThemeProvider>
    }
  </React.StrictMode>
);