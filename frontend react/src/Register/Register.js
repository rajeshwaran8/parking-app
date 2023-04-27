import { useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";


function Register() {
    const initialValues = { id: "", userName: "", email: "", password: "", confirmPassword: "" };
    const [formValues, setValues] = useState(initialValues);
    const [errorValues, setError] = useState({});
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...formValues, [name]: value });

    }
    const handlesubmit = (e) => {
        e.preventDefault();
        setError(validateForm(formValues));
        if (Object.keys(validateForm(formValues)).length === 0) {
            axios.post(`http://localhost:8080/park/save`, formValues)
                .then((response) => {
                    console.log(response.data);
                    setError({ sucess: "Registeration Sucessfully" });
                    navigate('/login')
                })
                .catch((error) => {
                    setError({ credential: "Registeration Failed" });
                    console.log(error);
                });
        }
    }

    const validateForm = (values) => {
        const errors = {};
        // const nameReg=/^[a-zA-Z. \\s]*$/i;
        if (!values.userName) {
            errors.userName = 'Username is invalid !!';
        }


        if (!values.email) {
            errors.email = 'Email is invalid !!';
        }
        if (!values.password) {
            errors.password = `Password is in valid !!`;
        }
        if (values.password !== values.confirmPassword) {
            errors.confirmPassword = `Mismatch password !!`
        }
        if (!values.confirmPassword) {
            errors.confirmPassword = `Passoword is Requierd !!`
        }
        return errors;
    }


    return (
        <div className="container-head">
            <div className="container">
                <div className="header">
                    <h2>Create Account</h2>

                </div>
                <form id="myForm" className="form" onSubmit={handlesubmit} >
                    {<div className="invalid">{errorValues.credential}</div>}
                    {<div className="sucess">{errorValues.sucess}</div>}
                    <br></br>
                    <div className="form-control">
                        <label>Username</label>
                        <input type="text" name="userName" id="userName" value={formValues.userName} onChange={handleChange} />
                        <div className="error">{errorValues.userName}</div>

                    </div>
                    <div className="form-control">
                        <label>Email</label>
                        <input type="email" name="email" id="email" value={formValues.email} onChange={handleChange} />
                        <div className="error">{errorValues.email}</div>

                    </div>
                    <div className="form-control">
                        <label>Password</label>
                        <input type="password" name="password" id="password" value={formValues.password} onChange={handleChange} />
                        <div className="error">{errorValues.password}</div>
                    </div>
                    <div className="form-control">
                        <label>Confirm Password</label>
                        <input type="password" name="confirmPassword" id="password2" value={formValues.confirmPassword} onChange={handleChange} />
                        <div className="error">{errorValues.confirmPassword}</div>
                    </div>
                    <button type="submit">Submit</button>
                    <div className="login-link"><Link to="/login">Already have an account?</Link>.</div>
                </form>
            </div>
        </div>
    );

}
export default Register;