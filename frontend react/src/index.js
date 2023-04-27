import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './App.css'
import reportWebVitals from './reportWebVitals';

import ReactModal from 'react-modal';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

ReactModal.setAppElement(document.getElementById('root'));
const stripePromise = loadStripe('pk_test_51MyueoSHD5TcZoiK0abYGGxB5cGrrFnK5cd6lmmVi9DJh1tSr7MqQWeQbMO51MD90uLgTm11l27ggjTrAf0J6E3700OTsmbonw');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <Map />
    <Elements stripe={stripePromise}>
        <App/>
   </Elements>
    );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
