import jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
  // Get from httpOnly cookie
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: 'Token inválido ou expirado.' });
  }
}

export { verifyToken }