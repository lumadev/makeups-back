import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const hashPassword = async (plainPassword) => {
  const saltRounds = 12;
  return await bcrypt.hash(plainPassword, saltRounds);
};

const comparePasswords = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed);
};

const generateToken = (user) => {
  const SECRET = process.env.SECRET;
  const payload = { username: user.username }

  return jwt.sign(payload, SECRET, {
    expiresIn: '8h',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.SECRET);
};

export {
  hashPassword,
  comparePasswords,
  generateToken,
  verifyToken,
};