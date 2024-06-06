// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const web3 = require('web3');

router.post('/login', async (req, res) => {
  const { walletAddress, signature } = req.body;

  // Verify the wallet address and signature using web3
  const message = `Login at ${new Date().toISOString()}`;
  const signer = web3.eth.accounts.recover(message, signature);

  if (signer.toLowerCase() !== walletAddress.toLowerCase()) {
    return res.status(401).json({ message: 'Invalid signature' });
  }

  // Check if user exists, if not, create a new user
  let user = await User.findOne({ walletAddress });
  if (!user) {
    user = new User({ walletAddress });
    await user.save();
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id, walletAddress: user.walletAddress }, 'your_jwt_secret', { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
