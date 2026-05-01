// config/db.js
const mongoose = require('mongoose');

// dotenv ഇവിടെ കോൺഫിഗർ ചെയ്യുന്നത് നല്ലതാണ്
require('dotenv').config();

const connectDB = async () => {
  try {
    // നിങ്ങളുടെ .env ഫയലിൽ MONGO_URI എന്നാണ് പേരെങ്കിൽ അത് തന്നെ ഇവിടെയും നൽകണം
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;