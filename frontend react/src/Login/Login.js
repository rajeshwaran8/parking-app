import { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
function Login(props) {

    const initialValues = { email: "", password: "" };
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
        if (Object.keys(validateForm(formValues)).length === 0) {
            axios.post(`http://localhost:8080/park/login?email=${formValues.email}&password=${formValues.password}`)
                .then((response) => {
                    if (response.data.data.email === 'ramseetha4249@gmail.com'
                        && response.data.data.password === '9090') {
                        props.onLogin('admin')
                        navigate('/admin');

                    } else {
                        props.onLogin('user');
                        navigate('/user');
                    }
                    console.log(response.data);
                })
                .catch((error) => {
                    setError({ credential: "Invalid email or password" });
                    console.log(error);
                });
        }
    }

    const validateForm = (values) => {
        const errors = {};
        if (!values.email) {

            errors.email = "email is requierd !!";
        }
        if (!values.password) {
            errors.password = `Password is required !!`
        }
        return errors;

    }


    return (
        <div className="container-head">
            <div className="container">
                <div className="header">
                    <h2>Login</h2>

                </div>

                <form id="myForm" className="form" onSubmit={handleSubmit} >
                    {<div className="invalid">{errorValues.credential}</div>}
                    <br></br>
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

                    <button type="submit">Submit</button>
                    <div className="login-link"><Link to="/register">Don't have an account?</Link>.</div>

                </form>
            </div>
        </div>

    )
}
export default Login;   