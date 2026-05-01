// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth'); // Middleware to protect routes

// 1. User Registration - POST /api/users/register
// പുതിയ യൂസറെ സിസ്റ്റത്തിൽ ചേർക്കാൻ
router.post('/register', userController.register);

// 2. User Login - POST /api/users/login
// ലോഗിൻ ചെയ്ത് ടോക്കൺ സ്വന്തമാക്കാൻ
router.post('/login', userController.login);

// 3. Get Logged-in User Data - GET /api/users/me
// നിലവിൽ ലോഗിൻ ചെയ്ത യൂസറുടെ വിവരങ്ങൾ എടുക്കാൻ (Protected)
router.get('/me', auth, userController.getUserData);

module.exports = router;