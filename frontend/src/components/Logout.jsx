import React from 'react';
import { googleLogout } from '@react-oauth/google';
import './Logout.css';


function Logout({ setUser, clientId }) {

  const logOut = () => {
    googleLogout();
    setUser(null);
    localStorage.setItem("login", null);
    console.log('Logout made successfully');
  };

  return (
    <div>
      <button onClick={logOut}
              type="button"
              className="btn logout-btn">
                <img src="/images/logout_white.png"
                style={{"height":"30px", "marginRight":"10px"}}></img>
      </button>
    </div>
  );
}

export default Logout;
