// app.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connect } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'your_jwt_secret_key'; // Change this to your own secret key

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Display the signup form
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

// Handle signup form submission
app.post('/signup', async (req, res) => {
    const db = await connect();
    const users = db.collection('users');

    try {
        // Check if the username already exists
        const existingUser = await users.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Insert the new user into the database
        await users.insertOne({ username: req.body.username, password: hashedPassword });

        // Generate JWT token
        const token = jwt.sign({ username: req.body.username }, JWT_SECRET);

        // Send the response with registration success message and token
        res.status(201).json({ message: 'Registration successful! Here is your token', token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

