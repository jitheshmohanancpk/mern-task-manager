require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// ശരിയായ റൂട്ട് ഫയലുകൾ ഇംപോർട്ട് ചെയ്യുന്നു
const userRoutes = require('./routes/userRoutes');
const customerRoutes = require('./routes/customerRoutes');

// ഡാറ്റാബേസ് കണക്ട് ചെയ്യുന്നു
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API റൂട്ടുകൾ - ഇവിടെ ശ്രദ്ധിക്കുക
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);



// ബേസിക് എറർ ഹാൻഡ്ലിംഗ്
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});