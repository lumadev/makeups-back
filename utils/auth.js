import bcrypt from 'bcrypt';

const SECRET = process.env.SECRET;

const hashPassword = async (plainPassword) => {
  const saltRounds = 12;
  return await bcrypt.hash(plainPassword, saltRounds);
};

const comparePasswords = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed);
};

const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, SECRET, {
    expiresIn: '1h',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

export {
  hashPassword,
  comparePasswords,
  generateToken,
  verifyToken,
};