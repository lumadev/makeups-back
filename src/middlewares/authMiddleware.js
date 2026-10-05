import jwt from 'jsonwebtoken'

function verifyToken(req, res, next) {
  // httpOnly cookie, with Authorization Bearer as fallback for browsers blocking third-party cookies
  const bearer = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : undefined
  const token = req.cookies?.token || bearer

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    req.user = decoded
    req.cookies = { ...req.cookies, token }
    next()
  } catch {
    return res.status(403).json({ message: 'Token inválido ou expirado.' })
  }
}

function requireRole(role) {
  return function (req, res, next) {
    const user = req.user

    if (user.type === 'admin') {
      next()
      return
    }

    // role pode ser string ou array de roles permitidas
    const roles = Array.isArray(role) ? role : [role]

    if (!roles.includes(user.type)) {
      return res.status(403).json({ error: 'Acesso negado' })
    }
    next()
  }
}

export { verifyToken, requireRole }