const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001; 

// Middleware
app.use(cors()); // Allow requests from any origin
app.use(express.json()); // To parse JSON request bodies

// In-memory "database" to store the most recent data
let latestAnswerData = "No data submitted yet.";

// POST endpoint to receive data
app.post('/api/create-answer', (req, res) => {
    console.log("Received POST request to /api/create-answer");
    console.log("Request body:", req.body);

    if (req.body && req.body.data) {
        latestAnswerData = req.body.data;
        console.log("Stored new data:", latestAnswerData);
        res.status(200).json({
            message: "Data received and stored successfully.",
            currentData: latestAnswerData
        });
    } else {
        console.log("Invalid data received.");
        res.status(400).json({
            message: "Invalid request. Body must contain a 'data' field.",
            expectedFormat: { "data": "your-text-here" }
        });
    }
});

// GET endpoint for the frontend to fetch the data
app.get('/api/get-answer', (req, res) => {
    console.log("Received GET request to /api/get-answer");
    res.status(200).json({
        data: latestAnswerData
    });
});

app.listen(PORT, '0.0.0.0', () => { // Listen on all network interfaces
    console.log(`Backend server running on port ${PORT}`);
    console.log(`POST endpoint: http://<your-ec2-ip>:${PORT}/api/create-answer`);
    console.log(`GET endpoint:  http://<your-ec2-ip>:${PORT}/api/get-answer`);
});