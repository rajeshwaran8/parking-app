import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./BookSlot.css";
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";


function BookSlot() {
  const location = useLocation().state.location;
  const availability = useLocation().state.availability;
  const slotNumber = useLocation().state.slotNumber;
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user);

  const [errors,setErrors]= useState({});
  const [vehicleNo, setVehicleNo] = useState("");
  const [price,setPrice]= useState(0);
  const [startTime,setStartTime] = useState('');
  const [endTime,setEndTime] = useState('');
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    
    const startTime = new Date(event.target["start-time"].value);
    const endTime = new Date(event.target["end-time"].value);
    const diffInMs = endTime - startTime;

    if (diffInMs < 60 ) {
      setErrors({ endTime: "End time should be at least 60 minutes after start time" });
      return;
    }
    const diffInHours = Math.round(diffInMs / (1000 * 60 * 60));

    const price = diffInHours * 50;
      if (price < 50) {
        return;
      }
    console.log(`Start Time: ${startTime}`);
    console.log(`End Time: ${endTime}`);
    console.log(`Price: ${price}`);

    setErrors({})
    setPrice(price)
    setEndTime(endTime)
    setStartTime(startTime)
    handleModalOpen();
  };

  const handleVehicleNoChange =(event)=>{


    const input = event.target;
    const value = input.value;

    // Validate input format
    const regex = /^[A-Z]{2}\s\d{2}\s[A-Z]{2}\s\d{4}$/;
    const isValidFormat = regex.test(value);

    setErrors((errors) => ({ ...errors, vehicleNo: !isValidFormat }));
    setVehicleNo(value);
  }
  const handleSure=()=> {
    
    navigate('/card',{
      state:{
        name:user.name,
        email:user.email,
        vehicleNo: vehicleNo,
        location: location,
        slotNumber:slotNumber,
        availability:availability,
        startTime:startTime,
        endTime:endTime,
        price: price
      }
    })

};
  

  return (
    <>
      <h2 style={{ textAlign: "center", marginTop: "30px" }}>
        Book Your Slot
      </h2>
      <div className="book-slot-container">
        <h2 className="slot-heading">Slot {slotNumber} Details</h2>
        <hr></hr>

        <div className="slot-details">
          <p>Location: {location}</p>
          <p></p>
        </div>
        <form onSubmit={handleSubmit}>
        <label htmlFor="vehicle-no">Vehicle No:</label>
        <input
            type="text"
             id="vehicle-no"
             name="vehicle-no"
             placeholder="Enter your Vehicle Number"
             required
             onChange={handleVehicleNoChange}
            pattern="^[A-Z]{2}\s\d{2}\s[A-Z]{2}\s\d{4}$"
            title="Please enter a valid vehicle number in the format: TN 69 BZ 0874"
        />
         {errors.vehicleNo && (
            <div className="error">Please enter a valid vehicle number in the format: TN 69 BZ 0874</div>
          )}

          <label htmlFor="start-time">Start Time:</label>
          <input
            type="datetime-local"
            id="start-time"
            name="start-time"
            min="${new Date().toISOString().substr(0, 16)}"
           required
          />
          <label htmlFor="end-time">End Time:</label>
          <input
            type="datetime-local"
            id="end-time"
            name="end-time"
            min="${new Date().toISOString().substr(0, 16)}"
            required
          />
          {errors.endTime && <p className="error">{errors.endTime}</p>}

          <button type="submit">Book Slot</button>
        </form>
      </div>
      <Modal isOpen={isModalOpen} 
      className= 'custom-modal'
      onRequestClose={handleModalClose}>
      
        <h2 className="confirm">Are You Sure {user.name} ? </h2>
        <hr></hr>
        <h3 className="data-show">Vehicle No: {vehicleNo}</h3>
        <h3 className="data-show">Location: {location}</h3>
        <h3 className="data-show">Price : {price}</h3>

        <ul className="unlist">
          <li><button onClick={handleModalClose}>Cancel</button></li>
          <li><button onClick={handleSure}>Sure</button></li>
        </ul>
      </Modal>
    </>
  );
}



export default BookSlot;
