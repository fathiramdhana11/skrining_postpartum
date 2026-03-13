const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // Keep user routes for profile fetching later

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API Skrining Postpartum Running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // User routes (protected later)
app.use('/api/screenings', require('./routes/screeningRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

module.exports = app;
