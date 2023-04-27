import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactTooltip from 'react-tooltip';

function AdminSlotView() {
  const [data, setData] = useState([]);
  const URL = 'http://localhost:8080/park/view-slot';
  const navigate = useNavigate();
  const [activeSlot, setActiveSlot] = useState(null);

  useEffect(() => {
    axios.get(URL)
      .then(response => {
        setData(response.data.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleEditClick = (slot) => {
    setActiveSlot(slot);
  };

  const handleDeleteClick = (slot) => {
    // TODO: implement delete functionality
  };

  return (
    <div id='tableComponent'>
      <div>
        <h2 className='text-center'>Parking Slots </h2>
      </div>
      <table className='table table-stripad'>
        <thead>
          <tr id='Hrow'>
            <th>Slot Number</th>
            <th> Start Date </th>
            <th> Last Date </th>
            <th> Action </th>
          </tr>
        </thead>
        <tbody id='bodytable'>
          {data.map(slot => (
            <tr key={slot.id}>
              <td>{slot.slotNumber}</td>
              <td>{slot.startDate}</td>
              <td>{slot.lastDate}</td>
              <td>
                <button className='my-button' onClick={() => handleEditClick(slot)}>
                  Edit
                </button>
                <button className="my-button-delete" onClick={() => handleDeleteClick(slot)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {activeSlot && (
        <div className='edit-form'>
          <h2>Edit Slot</h2>
          <label htmlFor='slotNumber'>Slot Number:</label>
          <input type='text' id='slotNumber' value={activeSlot.slotNumber} />
          <label htmlFor='startDate'>Start Date:</label>
          <input type='text' id='startDate' value={activeSlot.startDate} />
          <label htmlFor='lastDate'>Last Date:</label>
          <input type='text' id='lastDate' value={activeSlot.lastDate} />
          <button className='my-button' onClick={() => setActiveSlot(null)}>
            Cancel
          </button>
          <button className='my-button' onClick={() => { }}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminSlotView;
