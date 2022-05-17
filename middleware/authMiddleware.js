import jwt from 'jsonwebtoken'

export function validateAuthToken(req, res, next) {
  if (req.method === "OPTIONS") next();

  try {

    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
    return res.status(401).json({massage: 'Не авторизирован'})
    } else {

    const decoded = jwt.verify(token, 'Dmitry\'s secret corporation');
    req.user = decoded;
    next()
    }

  } catch (e) {
    res.status(401).jso({massage: 'Не авторизирован'})
  }
}
