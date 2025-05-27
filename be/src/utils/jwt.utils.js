const jwt = require('jsonwebtoken');
const { RefreshToken } = require('../models');

// Generate access token
const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Generate refresh token
const generateRefreshToken = async (user) => {
  const token = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );

  // Calculate expiry date
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now

  // Save the refresh token in the database
  await RefreshToken.create({
    token,
    user_id: user.id,
    expires_at: expiryDate
  });

  return token;
};

// Verify refresh token
const verifyRefreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    
    // Check if token exists in the database
    const refreshToken = await RefreshToken.findOne({ where: { token, user_id: decoded.id } });
    
    if (!refreshToken) {
      throw new Error('Invalid refresh token');
    }
    
    // Check if token is expired
    if (new Date() > new Date(refreshToken.expires_at)) {
      await refreshToken.destroy();
      throw new Error('Refresh token expired');
    }
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
};
