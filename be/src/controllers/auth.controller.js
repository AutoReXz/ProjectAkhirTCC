const argon2 = require('argon2');
const { User, RefreshToken, sequelize, Sequelize } = require('../models');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt.utils');

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Hash password with argon2
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id, // Use argon2id variant (recommended)
      memoryCost: 2**16,     // 64 MiB
      timeCost: 3,           // 3 iterations
      parallelism: 1         // 1 degree of parallelism
    });

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(), // Store email in lowercase
      password_hash: hashedPassword,
      role: 'user' // Default role
    });    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    // Set refresh token sebagai HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken
      // refreshToken tidak dikirim di response body untuk keamanan
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user (case-insensitive email lookup)
    const user = await User.findOne({ 
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('email')), 
        sequelize.fn('LOWER', email)
      ) 
    });

    if (!user) {
      // Return ambiguous message for security (don't reveal if email exists)
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password with argon2
    const validPassword = await argon2.verify(user.password_hash, password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }    // Check for old refresh tokens and clear them
    await RefreshToken.destroy({
      where: {
        user_id: user.id,
        expires_at: { [Sequelize.Op.lt]: new Date() }
      }
    });    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    // Set refresh token sebagai HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
    });

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken
      // refreshToken tidak dikirim di response body untuk keamanan
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    // Ambil refresh token dari cookie
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Verify refresh token
    const decoded = await verifyRefreshToken(refreshToken);
    
    // Get user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);
    
    res.status(200).json({
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    // Ambil refresh token dari cookie
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      // Find and delete refresh token from database
      const token = await RefreshToken.findOne({ where: { token: refreshToken } });
      
      if (token) {
        await token.destroy();
      }
      
      // Clear the HttpOnly cookie
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    }
    
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
