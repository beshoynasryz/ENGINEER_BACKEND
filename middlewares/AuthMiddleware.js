const expressAsyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');


exports.Auth = expressAsyncHandler(async (req, res, next) => {
  // Check if the Authorization header exists
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.log('No authorization header');
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  // Ensure the header starts with "Bearer"
  if (!authHeader.startsWith('Bearer ')) {
    console.log('Invalid token format');
    return res.status(401).json({ error: 'Token format is invalid. Must be Bearer <token>' });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];
  console.log('Extracted token:', token);

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Attach the decoded user data (id, role) to the request object
    req.user = { id: decoded.id, role: decoded.role };
    next(); // Continue to the next middleware
  } catch (err) {
    console.log('Token verification failed:', err.message);
    return res.status(403).json({ error: 'Token verification failed' });
  }
});
// middleware/authorizeRole.js
exports.AuthorizeRole = (...roles) => {
    return (req, res, next) => {
      console.log('User Role:', req.user.role);
      if (!roles.includes(req.user.role)) {
        return res.sendStatus(403); // Forbidden
      }
      next();
    };
  };
  
