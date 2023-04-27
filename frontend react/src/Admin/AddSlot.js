import { useState } from "react";
import axios from 'axios';
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function AddSlot() {
  const initialValues = { location_name: "", slots: "" }
  const [formValues, setValues] = useState(initialValues);
  const [errorValues, setError] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...formValues, [name]: value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(validateForm(formValues));
    console.log(formValues);
    if (Object.keys(validateForm(formValues)).length === 0) {
      axios.post(`http://localhost:8080/admin/add_location`, formValues)
        .then((response) => {
          console.log(response.data);
          setError({ success: "Added Successfully" })
          navigate('/view-slot')
        })
        .catch((error) => {
          setError({ credential: "Adding Failed !!" });
          console.log(error);
        });
    }
  }

  const validateForm = (values) => {
    const errors = {};
    if (!values.location_name) {
      errors.location_name = 'Location should not be empty !!';
    }

    if (!values.slots) {
      errors.slots = ' slots should not be empty !!';
    }
    if (!Number(values.slots)) {
      errors.slots = ' slots must be number only!!';
    }
    return errors;
  }



  return (
    <div className="container-head">
      <div className="container">
        <div className="header">
          <h2>Create Slot</h2>
        </div>
        <form id="myForm" className="form" onSubmit={handleSubmit}>
          {<div className="invalid">{errorValues.credential}</div>}
          {<div className="success" style={{ color: 'green', backgroundColor: '#c5f7c4' }}>{errorValues.success}</div>}
          <br></br>
          <div className="form-control">
            <label>Location</label>
            <input type="text" name="location_name" id="location_name" value={formValues.location_name} onChange={handleChange} />
            <div className="error">{errorValues.location_name}</div>
          </div>
          <div className="form-control">
            <label>Total Slots</label>
            <input type="text" name="slots" id="slots" value={formValues.slots} onChange={handleChange} />
            <div className="error">{errorValues.slots}</div>
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}