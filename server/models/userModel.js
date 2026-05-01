// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true, // ഒരേ ഇമെയിൽ രണ്ട് തവണ ഉപയോഗിക്കാൻ കഴിയില്ല
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6 // സുരക്ഷയ്ക്കായി കുറഞ്ഞത് 6 അക്ഷരങ്ങൾ
  }
}, {
  timestamps: true // createdat, updatedat എന്നിവ തനിയെ ഉണ്ടാകും
});

module.exports = mongoose.model('User', userSchema);