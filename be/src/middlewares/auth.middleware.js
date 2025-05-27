const jwt = require('jsonwebtoken');

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ 
      message: 'Token akses diperlukan',
      code: 'TOKEN_REQUIRED'
    });
  }

  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ 
      message: 'Format token tidak valid. Gunakan skema Bearer',
      code: 'TOKEN_INVALID_FORMAT' 
    });
  }
  
  const token = parts[1];
  
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        message: 'Token akses telah kedaluwarsa',
        code: 'TOKEN_EXPIRED'
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        message: 'Token tidak valid',
        code: 'TOKEN_INVALID' 
      });
    }
    
    return res.status(401).json({ 
      message: 'Autentikasi gagal',
      code: 'AUTH_FAILED' 
    });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Akses ditolak. Hak admin diperlukan.' });
  }
};

module.exports = {
  verifyAccessToken,
  verifyAdmin
};
