// controllers/userController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. User Registration
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // യൂസർ നിലവിൽ ഉണ്ടോ എന്ന് പരിശോധിക്കുന്നു
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // പാസ്‌വേഡ് ഹാഷ് ചെയ്യുന്നു (Security)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // പുതിയ യൂസറെ സേവ് ചെയ്യുന്നു
    user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// 2. User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ഇമെയിൽ പരിശോധിക്കുന്നു
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // പാസ്‌വേഡ് ഒത്തുനോക്കുന്നു
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // JWT ടോക്കൺ ജനറേറ്റ് ചെയ്യുന്നു
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// 3. Get User Data (Protected)
exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // പാസ്‌വേഡ് ഒഴിവാക്കി ബാക്കി വിവരങ്ങൾ
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Fetching user data failed" });
  }
};