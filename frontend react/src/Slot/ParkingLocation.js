import React, { useEffect, useState } from "react";
import "./ParkingSlot.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LocationBoxes() {
  const [parkingSlots, setParkingSlots] = useState([]);
  const [data,setData] = useState([]);
  const date = new Date();

  const user = JSON.parse(localStorage.getItem('user'));

  const navigate = useNavigate();
  const handleBoxClick = (location) => {
    console.log(location);

    axios
      .post("http://localhost:8080/user/select_location", { location })
      .then((response) => {
        console.log(response,"radhjdtsy");
        setParkingSlots(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    axios.get(`http://localhost:8080/user/select_all`)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);


  const handleSlotClick = (location,availability,slotNumber) => {

    navigate("/book-slot", {
      state: { location, availability, slotNumber },
    });
  };

  

  const renderParkingSlots = () => {
    if (parkingSlots && parkingSlots.length > 0) {
      return (
        <>
        

          {parkingSlots.map((slot) => {
            // const endDate = new Date(slot.end_date);
            // const currentDate = new Date();
            // if (slot.availability === 0 && currentDate > endDate) {
            //   slot.availability = 1;
            // }
            return (
              <div
                key={slot.slots}
                className={`parking-slott ${
                  slot.availability === 0 ? "unavailable" : ""
                }`}
                onClick={() => {
                  if (slot.availability > 0) {
                    handleSlotClick(
                      slot.location_name,
                      slot.availability,
                      slot.slots
                    );
                  }
                }}
              >
                {slot.availability < 1 ? (
                  <p>Booked</p>
                ) : (
                  <>
                    <p>Slot No: {slot.slots}</p>
                    <p>Status: {slot.availability}</p>
                  </>
                )}
              </div>
            );
          })}
          
        </>
      );
    }
  };
  

  return (
    <>
      <h2 style={{ textAlign: "center", marginTop: "30px" }}>
     Welcome {user.name} <br></br> <br></br>  Choose You Parking Location
      </h2>


      <div className="location-boxes">
      {data.map((loc)=>(
      <div className="location-box" 
         key={loc[0]}
          onClick={() => handleBoxClick(loc[1])}>
          {loc[1]}
          <br></br>
                
        </div>))}
      </div>

      <div><br></br><hr></hr>{ parkingSlots.length > 0 ?(<h3 className="slot_park">Parking slots in {parkingSlots[0].location_name}</h3>):(<h3 className="slot_park">No Parking slots choose, So Choose Above Location</h3>)}</div>
      
      <div className="parking-slotss">{renderParkingSlots()}</div>
      <div className="status">
      <div className="red" >
        </div>
        <span>Booked</span>
        <br/>

        <div className="green" >
        </div>

        <span>Available</span>
      </div>
    </>
  );
}

export default LocationBoxes;
