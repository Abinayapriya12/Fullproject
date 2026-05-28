const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let token = req.cookies?.token;
    // Check Authorization header if no cookie
    if (!token && req.headers.authorization) {
        

        // Remove 'Bearer ' prefix if present
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.slice(7); // Extract token after 'Bearer '
         
        } else {
            token = authHeader; // fallback (not recommended but kept for compatibility)
          
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Request denied. No token provided."
        });
    }

    try {
        
        const verified = jwt.verify(token, process.env.SECRET_KEY);
       
        req.user = verified;
        next();
    } catch (err) {
        console.error('Token verification error:', err.message); // helpful for debugging
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = { verifyToken };