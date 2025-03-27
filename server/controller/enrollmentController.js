const express = require('express');
const router = express.Router();
const { authMiddleware  } = require('../middleware/authMiddleware'); 
const Enrollment = require('../models/enrollments')
const mongoose = require('mongoose');

// To enroll a student for a course
exports.enrollCourse = async (req, res) => {
    const userId = req.body.userID;
    const { courseId, paymentId, price } = req.body; 

    try {
        // Check if the enrollment already exists
        const existingEnrollment = await Enrollment.findOne({ userID: userId, courseID: courseId });
        if (existingEnrollment) {
            return res.status(400).json({ message: 'User is already enrolled in this course' });
        }

        // Conditionally set paymentID to null if the price is 0 or paymentId is not provided
        let paymentObjectId = null;
        if (price > 0 && paymentId) {
            paymentObjectId = new mongoose.Types.ObjectId(paymentId);
        }

        // Create a new enrollment
        const enrollment = await Enrollment.create({
            userID: new mongoose.Types.ObjectId(userId),
            courseID: new mongoose.Types.ObjectId(courseId),
            paymentID: paymentObjectId
        });
        console.log("userId=", userId);
        console.log("courseId=", courseId);
        console.log("paymentId=", paymentObjectId);


        if (enrollment) {
            return res.status(200).json({ message: 'Enrollment successful', enrolled: true });
        } else {
            return res.status(400).json({ message: 'Enrollment failed', enrolled: false });
        }
    } catch (error) {
        console.error('Enrollment error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Check if a user is enrolled in a course
exports.checkEnrollment = async (req, res) => {
    const { courseId, userId } = req.params;
    console.log(`Checking enrollment for courseId: ${courseId}, userId: ${userId}`);

    try {
        const enrollment = await Enrollment.findOne({ 
            courseID: new mongoose.Types.ObjectId(courseId), 
            userID: new mongoose.Types.ObjectId(userId) 
        });

        console.log("Enrollment result:", enrollment);
        if (enrollment) {
            return res.status(200).json({ message: 'User is already enrolled', enrolled: true });
        } else {
            return res.status(200).json({ message: 'User is not enrolled', enrolled: false });
        }
    } catch (error) {
        console.error('Error checking enrollment status:', error);
        return res.status(500).json({ message: 'Server error while checking enrollment' });
    }
};
