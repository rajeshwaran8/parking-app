import { useEffect, useState } from "react";
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import './signin.css';

import { Navigate, useNavigate } from "react-router-dom";
const CLIENT_ID = `1036923983401-45ovges72pbtbh9ipvatt21di3follai.apps.googleusercontent.com`

function SignIn({ onLogin, onAdminLogin }) {

  const [user, setUser] = useState({})
  const navigate = useNavigate()

  function handleCallBackResponse(response) {
    console.log(`Encoded jwt ${response.credential}`)
    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject);

    // Send user information to backend using Axios
    axios.post('http://localhost:8080/park/signin', userObject)
      .then(response => {
        console.log(response);
        localStorage.setItem('user', JSON.stringify(response.data));
        const user = JSON.parse(localStorage.getItem('user'));

        console.log(typeof onAdminLogin)
        if (user.email === "raje2001k@gmail.com" && user.name === "admin a") {
          onAdminLogin()
          navigate('/users')

        } else {

          onLogin();
          navigate('/slots')
        }

      })
      .catch(error => {
        console.log(error);
      });
  }

  useEffect(() => {
    const google = window.google;
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCallBackResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("signInButton"),
      {
        theme: "outline",
        size: "large",
      }
    );

  }, []);

  return (

    <>
     

      <div className="hompage">
      <div className="sign-in">
        <div id="signInButton" style={{ display: 'flex', justifyContent: 'flex-end' }}></div>
      </div>
        <h2>RMR Parking</h2>
        <div className="para">
          <p>This Application Help For People Who Are Looking for Vehicle Parking In Main Public Places</p>
        </div>
      </div>
    </>
  );
}

export default SignIn;
