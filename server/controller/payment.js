const express = require("express");
const Stripe = require("stripe");
const dotenv = require("dotenv");
const Payment = require("../models/payment");  
const mongoose = require('mongoose');

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Middleware for parsing JSON
router.use(express.json());

// Create Payment Intent
const paymentController = async (req, res) => {
    try {
        const { amount, userId } = req.body;

        if (!amount || !userId) {
            return res.status(400).json({ error: "Amount and User ID are required" });
        }

        // Convert userId to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,  // Amount in cents
            currency: "usd",
            automatic_payment_methods: { enabled: true },
        });

        // Store payment record in MongoDB
        const payment = new Payment({
            userId: userObjectId,  // Converted ObjectId
            amount: amount / 100,  // Convert cents to dollars for storage
            transactionId: paymentIntent.id,
            status: "pending",
        });
        await payment.save();

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Payment Intent Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Webhook for Payment Status
const handleWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];

    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object;

            // Update Payment Record
            await Payment.findOneAndUpdate(
                { transactionId: paymentIntent.id },
                { status: "successful" }
            );
        }

        res.json({ received: true });
    } catch (err) {
        console.error("Webhook Error:", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
};

const updatePaymentStatus =  async (req, res) => {
    try {
        const { transactionId, status } = req.body;

        // Find and update the payment status
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId },
            { status },
            { new: true }
        );

        if (!updatedPayment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.json({ message: "Payment status updated successfully", payment: updatedPayment });

    } catch (error) {
        console.error("Error updating payment status:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Export functions using CommonJS
module.exports = { paymentController, handleWebhook ,updatePaymentStatus};
