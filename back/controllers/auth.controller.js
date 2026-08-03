const { registerUser, loginUser } = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const { user, token } = await registerUser({ username, email, password });
    return res.json({ jwt: token, user });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { identifier, password } = req.body;
    const { user, token } = await loginUser({ identifier, password });
    return res.json({ jwt: token, user });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
};
