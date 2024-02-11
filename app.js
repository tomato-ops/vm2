// app.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// In-memory user database (replace this with a real database in production)
const users = [];

// Register endpoint
app.post('/register', async (req, res) => {
    try {
        // Hash the user's password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        // Create a new user object
        const user = { username: req.body.username, password: hashedPassword };
        
        // Add the user to the in-memory database
        users.push(user);
        
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const user = users.find(u => u.username === req.body.username);
    
    if (user == null) {
        return res.status(400).send('User not found');
    }

    try {
        // Check if the provided password matches the hashed password
        if (await bcrypt.compare(req.body.password, user.password)) {
            // Generate a JWT token
            const token = jwt.sign({ username: user.username }, 'secret');
            res.json({ token });
        } else {
            res.status(401).send('Incorrect password');
        }
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
