const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3013;
const app = express();

app.use(express.static(__dirname)); // Serve static files
app.use(express.urlencoded({ extended: true })); // Parse form data

mongoose.connect("mongodb://localhost:27017/RES", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once('open', () => {
    console.log("Mongo connected");
});

// Define the reservation schema
const reservationSchema = new mongoose.Schema({
    count: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
});

// Create the model
const Reservation = mongoose.model("Reservation", reservationSchema);

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Handle form submission
app.post('/post', async (req, res) => {
    const { count, date, time } = req.body;

    try {
        const reservation = new Reservation({ count, date, time });
        await reservation.save();
        console.log("Reservation saved:", reservation);
        res.send("Yup it is available");
    } catch (error) {
        console.error("Error saving reservation:", error);
        res.status(500).send("There was an error processing your reservation.");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
