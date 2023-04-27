import './App.css';
import './Nav/Nav.css';

import { BrowserRouter as Router, Route, Routes, BrowserRouter, NavLink } from "react-router-dom";
import { useState } from 'react';
import SignIn from './Login/SignIn';
import LocationBoxes from './Slot/ParkingLocation';
import NotFound from './NotFound';
import BookSlot from './Slot/BookSlot';
import Payment from './Payment/Payment';
import History from './Slot/SlotView';
import AddSlot from './Admin/AddSlot';
import ShowLocations from './Admin/Admin';
import Users from './Admin/Users';
function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');

  function handleLogin() {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', true);

  }

  function handleLogout() {
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');


  }

  function adminLogin() {
    setIsAdmin(true);
    localStorage.setItem('isAdmin', true);

  }

  function adminLogout() {
    setIsAdmin(false)
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');


  }

  function getNavLinks() {
    if (isAdmin) {
      return (
        <>
          <li>
            <NavLink to="/users" className="login">
              Users
            </NavLink>
          </li>
          <li>
            <NavLink to="/view-slot" className="view">
              Location
            </NavLink>
          </li>
          <li>
            <NavLink to="/add-slot" className="show-slot">
              Add Slot
            </NavLink>
          </li>
          <li>
            <NavLink onClick={adminLogout} className='register' to='/' > Log Out</NavLink>
          </li>


        </>

      )
    } else if (isLoggedIn) {
      return (
        <>
          <li>
            <NavLink to="/slots" className="login">
              Slots
            </NavLink>
          </li>
          <li>
            <NavLink to="/show" className="show-slot">
              Historys
            </NavLink>
          </li>

          <li>
            <NavLink onClick={handleLogout} className='register' to='/' >Log out</NavLink>
          </li>
        </>
      )
    } else {
      return (
        <li>
          <NavLink to='/' className='login'>Log in</NavLink>
        </li>

      )

    }

  }


  return (
    <>
      <BrowserRouter>
        <nav className="navbar">
          {
            isAdmin ? (<><h1 className="logo">Admin</h1>
            </>)
              : (<>
                <h1 className="logo">Parking</h1>
              </>)
          }
          <div className="menu-icon">

          </div>
          <ul className='nav-links'>

            {getNavLinks()}
          </ul>
        </nav>

        <Routes>
          {
            isAdmin ? (
              <>
                <Route path="/users" element={<Users />} />
                <Route path="/view-slot" element={<ShowLocations />} />
                <Route path="/add-slot" element={<AddSlot />} />

              </>
            ) : (
              <>
                {isLoggedIn ? (
                  <>
                    <Route path="/slots" element={<LocationBoxes />} />
                    <Route path="/show" element={<History />} />
                    <Route path='/book-slot' element={<BookSlot />} />
                    <Route path='/card' element={<Payment />} />

                  </>
                ) : (
                  <Route path="/" element={<SignIn onAdminLogin={adminLogin} onLogin={handleLogin} />} />
                )}
              </>
            )
          }
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;