import jwt from 'jsonwebtoken'

function verifyToken(req, res, next) {
  // Get from httpOnly cookie
  const token = req.cookies?.token

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(403).json({ message: 'Token inválido ou expirado.' })
  }
}

function requireRole(role) {
  return function (req, res, next) {
    const user = req.user

    // role pode ser string ou array de roles permitidas
    const roles = Array.isArray(role) ? role : [role]

    if (!roles.includes(user.type)) {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    next()
  }
}

export { verifyToken, requireRole }