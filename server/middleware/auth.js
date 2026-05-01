// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // ഹെഡറിൽ നിന്ന് ടോക്കൺ എടുക്കുന്നു
  const token = req.header('Authorization');

  // ടോക്കൺ ഇല്ലെങ്കിൽ
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // 'Bearer <token>' എന്ന ഫോർമാറ്റിൽ നിന്ന് ടോക്കൺ മാത്രം വേർതിരിക്കുന്നു
    const bearerToken = token.split(' ')[1] || token;
    
    // ടോക്കൺ വെരിഫൈ ചെയ്യുന്നു
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);

    // യൂസർ വിവരങ്ങൾ റിക്വസ്റ്റിലേക്ക് ചേർക്കുന്നു
    req.user = decoded;
    
    next(); // അടുത്ത ഫങ്ക്ഷനിലേക്ക് (Controller) പോകാൻ
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};