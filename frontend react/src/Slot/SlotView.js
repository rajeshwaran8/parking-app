import { useEffect, useState } from "react";
import axios from 'axios';
import "./Slot.css";

export default function History() {
  const [userData, setData] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));

  const URL = `http://localhost:8080/user/histroy?email=${user.email}`;

  useEffect(() => {
    axios.get(URL, { withCredentials: true })
      .then(response => {
        console.log(response);
        setData(response.data)

      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const formatDate = (d) => {
    const date = new Date(d);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const formattedDate = `${day}/${month}/${year} -  ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  };
  

  return (
    <div id='tableComponent'>
      <h1 className="text-center">Your History</h1>
      
      {userData && userData.length === 0 && <h4 style={{textAlign:'center'}}>No history found.</h4>}
      {userData.length > 0 && (
        <table>
          <thead>
            <tr id="Hrow">
              <th>Vehicle</th>
              <th>Name</th>
              <th>Email</th>
              <th>Slot</th>
              <th>Location</th>
              <th>From</th>
              <th>To</th>
              <th>Paid </th>


              
            </tr>
          </thead>
          <tbody id="bodytable">
            {userData.map((vehicle) => (
              <tr key={vehicle[0]}>
                <td>{vehicle[1]}</td>
                <td>{vehicle[2]}</td>
                <td>{vehicle[3]}</td>
                <td>{vehicle[4]}</td>
                <td>{vehicle[5]}</td>
                <td>{vehicle[6]}</td>
                <td>{vehicle[7]}</td>
                <td>Rs : {vehicle[8]} </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
