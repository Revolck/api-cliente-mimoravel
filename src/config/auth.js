const jwt = require('jsonwebtoken');

// Usar uma variável de ambiente para o segredo do JWT ou um valor padrão para desenvolvimento
const secret = process.env.JWT_SECRET || 'your_jwt_secret';
const expiresIn = '1h';

exports.generateToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn });
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Token inválido.');
  }
};
