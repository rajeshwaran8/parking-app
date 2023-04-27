import { useEffect, useState } from "react";
import axios from "axios";
import './Admin.css'
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";

function Users() {

    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSlot, setActiveSlot] = useState(null);
    const [showAll, setShowAll] = useState(false);



    useEffect(() => {
        axios.get(`http://localhost:8080/admin/histroy`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);



    let filteredData = data.filter(vehicle => {
        const vehi = vehicle[1].toLowerCase();
        const user = vehicle[2].toString();
        const email = vehicle[3].toString();
        const slotNumber = vehicle[4].toString();
        const loc = vehicle[5].toString();
        const start = vehicle[6].toString();
        const end = vehicle[7].toString();
        const price = vehicle[8].toString();

        const query = searchQuery.toLowerCase();
        return vehi.includes(query) || user.includes(query) || email.includes(query) || slotNumber.includes(query) || loc.includes(query) || start.includes(query) || end.includes(query) || price.includes(query);
    });

    if (!showAll) {
        filteredData = filteredData.slice(0, 10);
    }

    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
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
                <h1 className="text-center">Users Details</h1>
                {filteredData && filteredData.length === 0 && <h4 style={{ textAlign: 'center' }}>Nothing found.</h4>}
                {filteredData.length > 0 && (
                    <>
                        <table id="customers">
                            <thead>
                                <tr>
                                    <th>Vechile</th>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Slot No</th>
                                    <th>Location</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Price</th>

                                </tr>
                            </thead>
                            <tbody>

                                {filteredData.map((vehicle) => (
                                    <tr key={vehicle[0]}>
                                        <td>{vehicle[1]}</td>
                                        <td>{vehicle[2]}</td>
                                        <td>{vehicle[3]}</td>
                                        <td>{vehicle[4]}</td>
                                        <td>{vehicle[5]}</td>
                                        <td>{vehicle[6]}</td>
                                        <td>{vehicle[7]}</td>
                                        <td>{vehicle[8]}</td>


                                        {/* <td>
                                        <button className='my-button' onClick={() => handleEditClick(vehicle)}>
                                        Edit                                                                          
                                        </button>
                                        <button className="my-button-delete" onClick={() => handleDeleteClick(vehicle)}>
                                        Delete
                                     </button>
                                        </td> */}
                                    </tr>

                                ))}
                            </tbody>
                        </table>

                    </>
                )}
            </div>

        </>
    );
}

export default Users;
