import React, { useState } from "react";
import { jsPDF } from "jspdf";
import certificateBg from "../../Assets/images/certificate-template-2.png";
import greatVibesBase64 from '../../Assets/Fonts/greatVibesBase64';
import signature from "../../Assets/images/signature-3.png";

const Certificate = ({
    userName = "John Doe",
    firstName = "John",
    lastName = "Doe",
    courseName = "React Development",
    marksPassed = "85%",
    dateAttended = "March 20, 2024",
    certificateBackground = certificateBg, 
}) => {
    const [showCertificateButton, setShowCertificateButton] = useState(true);

    const generateCertificate = () => {
        const doc = new jsPDF("landscape", "mm", "a4"); // Landscape mode, A4 size

        // // Simulate quiz completion
        // const handleQuizCompletion = () => {
        //     setShowCertificateButton(true);
        // };

        // Load Background Image
        const img = new Image();
        img.src = certificateBackground;
        img.crossOrigin = "anonymous"; // Avoid CORS issues

        img.onload = () => {
            // Add background image
            doc.addImage(img, "PNG", 0, 0, 297, 210); // Full page background 

            // Add the custom font to the VFS (Virtual Font Storage)
            doc.addFileToVFS("GreatVibes-Regular.ttf", greatVibesBase64); // Add Base64 encoded font
            doc.addFont("GreatVibes-Regular.ttf", "GreatVibes", "normal"); // Register the font

            // User Name
            doc.setTextColor(0, 102, 204);
            doc.setFont("times", "bold");
            doc.setFontSize(22);
            doc.text(userName, 148, 110, null, null, "center");
           
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(16);
            doc.text(`for successfully completing the quiz and demonstrating`, 148, 125, null, null, "center");
            doc.text(`proficiency in the subject.`, 148, 133, null, null, "center");

            // Issue Date
            const issueDate = new Date().toLocaleDateString();
            doc.text(`${issueDate}`, 101, 160);

            // Signature Placeholder
            doc.addImage(signature, "PNG", 172, 130, 40, 40);

            // Save PDF
            doc.save(`${userName}_Certificate.pdf`);
        };
    };

    return (
        <div className="certificate-div">
            {showCertificateButton && (
                <button onClick={generateCertificate} className="attend-quiz-button">
                    Download Certificate
                </button>
            )}
        </div>
    );
};

export default Certificate;
