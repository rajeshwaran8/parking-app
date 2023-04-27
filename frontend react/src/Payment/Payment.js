import { useState } from "react";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import './Payment.css'
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Util imports
import { makeStyles } from '@material-ui/core/styles';
import { useLocation, useNavigate } from "react-router-dom";
import CardInput from "./CardInput";





const useStyles = makeStyles({
  root: {
    maxWidth: 500,
    margin: 'auto',
    backgroundColor: '#ffffff',
    marginTop: '20px'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-start',
  },
  div: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    margin: '2em auto 1em',
  },
});




function Payment() {
  const classes = useStyles();
  // State
  const [email, setEmail] = useState('');

  const stripe = useStripe();
  const elements = useElements();

  const name = useLocation().state.name;
  const mail = useLocation().state.email;
  const slotNumber = useLocation().state.slotNumber;
  const location = useLocation().state.location;
  const vehicleNo = useLocation().state.vehicleNo;
  const startTime = useLocation().state.startTime;
  const endTime = useLocation().state.endTime;
  const price = useLocation().state.price;

  const [data, setData] = useState({
    name: name, email: mail, slotNumber: slotNumber,
    vehicleNo: vehicleNo, startTime: startTime, endTime: endTime,
    price: price, location: location
  })


  const navigate = useNavigate();

  const handleSubmitPay = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const res = await axios.post('http://localhost:8080/payment', { email: email, price: price });

    const clientSecret = res.data['client_secret'];

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email: email,
        },
      },
    });

    if (result.error) {

      console.log(result.error.message);

    } else {
      if (result.paymentIntent.status === 'succeeded') {

        try {
          const updateRes = await axios.post('http://localhost:8080/booked', data);
          console.log(updateRes.data);
          console.log('paid');

          toast.success('Payment Successfull !!!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",

          }
          )
          console.log(data.startTime);
          setTimeout(() => {
            navigate('/slots');
          }, 3000);
        } catch (error) {
          console.log(error);

          toast.error('Payment Failed!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });

          setTimeout(() => {
            navigate('/slots');
          }, 5000);
        }
      }
    }
  };




  return (

    <>
      {console.log(data.startTime)}
      <div className="pay-container">
        <h2 style={{ textAlign: 'center' }}> Card Payment</h2>

        <h4 style={{ textAlign: 'center' }}> Rs : {price}</h4>
        <hr />
        <Card className={classes.root}>
          <CardContent className={classes.content}>
            <TextField
              label='Email'
              id='outlined-email-input'
              helperText={`Email you'll recive updates and receipts on`}
              margin='normal'
              variant='outlined'
              type='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <CardInput />
            <div className={classes.div}>
              <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmitPay}>
                Pay
              </Button >
              <ToastContainer />
            </div>
          </CardContent>
        </Card >
      </div>

    </>

  );

}

export default Payment;
