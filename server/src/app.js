const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');
const authRoutes = require('./routes/authRoutes');

const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

//Routes
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

module.exports = app;