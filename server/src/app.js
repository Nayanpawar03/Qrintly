const express = require('express');
const cors = require('cors');

const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

module.exports = app;