const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    // 1. Get the token from the headers
    const auth = req.headers['authorization'];
    
    if (!auth) {
        return res.status(403).json({ message: 'Unauthorized, JWT token is required' });
    }
    
    try {
        // 2. Verify the token using your secret key
        // Make sure process.env.JWT matches what you used in AuthController.js
        const decoded = jwt.verify(auth, process.env.JWT);
        
        // 3. Attach the decoded user info (like _id) to the request object
        req.user = decoded; 
        
        next(); // Move on to the next function
    } catch (err) {
        return res.status(403).json({ message: 'Unauthorized, JWT token wrong or expired' });
    }
}

module.exports = ensureAuthenticated;