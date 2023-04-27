import { useEffect, useState } from "react";
import axios from "axios";
import './Admin.css'
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ShowLocations() {

  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlot, setActiveSlot] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avail, setAvail] = useState({});
  const [error, setError] = useState({});


  const navigate = useNavigate();

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    axios.get(`http://localhost:8080/admin/show_slots`)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  // const formatDate = (d) => {
  //     const date = new Date(d);
  //     const day = date.getDate();
  //     const month = date.getMonth() + 1;
  //     const year = date.getFullYear();
  //     const hours = date.getHours();
  //     const minutes = date.getMinutes();
  //     const seconds = date.getSeconds();
  //     const formattedDate = `${day}/${month}/${year} -  ${hours}:${minutes}:${seconds}`;
  //     return formattedDate;
  //   };

  let filteredData = data.filter(vehicle => {
    const location = vehicle[1].toLowerCase();
    const slotNumber = vehicle[2].toString();
    const availability = vehicle[3].toString();
    const query = searchQuery.toLowerCase();
    return location.includes(query) || slotNumber.includes(query) || availability.includes(query);
  });

  if (!showAll) {
    filteredData = filteredData.slice(0, 10);
  }

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  }

  const handleEditClick = (slot) => {
    const activeSlot = slot.reduce((acc, cur, index) => {
      if (index === 1) {
        acc.location = cur;
      } else if (index === 2) {
        acc.slotNumber = cur;
      } else if (index === 3) {
        acc.availability = cur;
      } else if (index === 4) {
        acc.startDate = cur;
      } else if (index === 5) {
        acc.endDate = cur;
      }
      return acc;
    }, {});
    setActiveSlot(activeSlot);
    console.log(activeSlot);
    setAvail(activeSlot.availability)
    handleModalOpen();
  };



  const handleDeleteClick = (slot) => {
    console.log(slot[0])
    axios.delete(`http://localhost:8080/admin/delete_slots/${slot[0]}`)
      .then(response => {
        console.log(response)
        setData(prevData => prevData.filter(item => item[0] !== slot[0]));
        navigate('/view-slot');
      })
      .catch(error => {
        console.error(error);
      });

  };
  const handleData = (event) => {

    const { name, value } = event.target;
    setActiveSlot({ ...activeSlot, [name]: value })

  }
  const submitData = (e) => {
    e.preventDefault();

    setError(validateError(activeSlot));

    console.log(activeSlot)
    if (Object.keys(validateError(activeSlot)).length === 0) {
      axios.put(`http://localhost:8080/admin/update_slots`, activeSlot)
        .then((response) => {
          console.log(response.data);
          handleModalClose();
          navigate('/view-slot')

        })
        .catch((error) => {
          // setError({credential: "updated Failed"});
          console.log(error);
        });
    }
  }
  const validateError = (values) => {
    const err = {};
    if (!Number(values.availability)) {
      err.availability = 'It should be number !!'
    }
    if (values.availability > 1 || values.availability < 1) {
      err.availability = `Please give only 1 as an input !!!`;
    }
    return err;
  }


  return (
    <>
      <div className="contain-loc">
        <div className="search-local">
          <input type="text" placeholder="Search..." value={searchQuery} onChange={handleSearchQueryChange} />
        </div>
        {!showAll && (
          <button className="show-all-button" onClick={() => setShowAll(true)}>Show All</button>
        )}
        <h1 className="text-center">Location Details</h1>
        {filteredData && filteredData.length === 0 && <h4 style={{ textAlign: 'center' }}>Nothing found.</h4>}
        {filteredData.length > 0 && (
          <>
            <table id="customers">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Slot Number</th>
                  <th>Availability</th>
                  <th colSpan={2}>Changes</th>
                </tr>
              </thead>
              <tbody>

                {filteredData.map((vehicle) => (
                  <tr key={vehicle[0]}>
                    <td>{vehicle[1]}</td>
                    <td>{vehicle[2]}</td>
                    <td>{vehicle[3]}</td>
                    {
                      vehicle[3] === 0 &&
                      <td >
                        <button className='my-button' onClick={() => handleEditClick(vehicle)}>
                          Edit
                        </button>

                      </td>
                    }
                    <td>
                      <button className="my-button-delete" onClick={() => handleDeleteClick(vehicle)}>
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}
              </tbody>
            </table>

          </>
        )}
      </div>
      <Modal isOpen={isModalOpen}
        className="container-head"
        onRequestClose={handleModalClose}>
        <div className="container">
          <div className="header">
            <h2>Make Available</h2>
          </div>
          <form id="myForm" className="form" onSubmit={submitData} >
            <br></br>
            {
              avail === 0 &&
              <div className="form-control">
                <label>Availability</label>
                <input type="text" name="availability" id="availability" value={activeSlot.availability} onChange={handleData} />
                <div className="error">{error.availability}</div>

              </div>
            }
            {/* {
            activeSlot.availability !== 0 &&
             <div className="form-control">
                <label>Availability</label>
                <input type="text" name="availability" id="availability" value={activeSlot.availability} readOnly onChange={handleData}/>
            </div>
        } */}

            {/* <div className="form-control">
                <label>start date</label>
                <input type="datetime-local" name="startDate" id="startDate"value={activeSlot.startDate} onChange={handleData}/>
            </div>

            <div className="form-control">
                <label>end date</label>
                <input type="datetime-local" name="endDate" id="endDate" value={activeSlot.endDate} onChange={handleData}/>
            </div> */}

            <button type="submit">Make Availability</button>
            <ToastContainer />

            <button onClick={handleModalClose}>Cancel</button>
          </form>
        </div>

      </Modal>
    </>
  );
}

export default ShowLocations;
