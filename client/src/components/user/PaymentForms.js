import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import axios from 'axios';

const PaymentForm = ({ amount, userId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        if (!stripe || !elements) {
            console.error("Stripe.js has not loaded yet.");
            setLoading(false);
            return;
        }
    
        // Ensure elements are submitted before confirming payment
        const submitResult = await elements.submit();
        if (submitResult.error) {
            alert(submitResult.error.message);
            setLoading(false);
            return;
        }
    
        // Confirm Payment with the same clientSecret
        const result = await stripe.confirmPayment({
            elements,
            redirect: "if_required"
            // confirmParams: {
            //     return_url: "http://localhost:3000/success",
            // },
        });
    
        if (result.error) {
            alert(result.error.message);
        } else {
            // Send transaction details to backend
            const response = await axios.post("http://localhost:5000/update-payment-status", {
                userId,
                amount,
                currency: "usd",
                transactionId: result.paymentIntent.id,
                status: result.paymentIntent.status,
            }, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.ok) {
                alert("Payment Successful!");
                // Now manually redirect to success page
                window.location.href = "http://localhost:3000/success";
            } else {
                console.error("Error saving transaction.");
            }
        }
        setLoading(false);
    };
    
    
    return (
        <form onSubmit={handlePayment}>
            <PaymentElement />
            <button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Pay Now"}
            </button>
        </form>
    );
};

export default PaymentForm;
