const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function comparePasswords(inputPassword, hashedPassword) {
  return bcrypt.compare(inputPassword, hashedPassword);
}

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

module.exports = {
  comparePasswords,
  generateToken,
};
