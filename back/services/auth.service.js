const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

async function registerUser({ username, email, password }) {
  if (!username || !email || !password) {
    throw createHttpError(400, 'Username, email and password are required.');
  }

  const existingByEmail = await userModel.findByEmail(email);
  if (existingByEmail) {
    throw createHttpError(409, 'Email already in use.');
  }

  const existingByUsername = await userModel.findByUsername(username);
  if (existingByUsername) {
    throw createHttpError(409, 'Username already in use.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await userModel.createUser({ username, email, password_hash: passwordHash });
  const user = {
    id: Number(newUser.insertId),
    username,
    email,
  };
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '7d',
  });

  return { user, token };
}

async function loginUser({ identifier, password }) {
  if (!identifier || !password) {
    throw createHttpError(400, 'Identifier and password are required.');
  }

  const user = (await userModel.findByEmail(identifier)) || (await userModel.findByUsername(identifier));
  if (!user) {
    throw createHttpError(401, 'Invalid credentials.');
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid credentials.');
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '7d',
  });

  return {
    user: {
      id: Number(user.id),
      username: user.username,
      email: user.email,
    },
    token,
  };
}

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

module.exports = {
  registerUser,
  loginUser,
};
