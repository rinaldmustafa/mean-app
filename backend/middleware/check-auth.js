const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "sercret_key_which_is_long_string");
    req.userDatas = { email: decodedToken.email, userId: decodedToken.userId }
    next();
  } catch(error) {
    res.status(401).json({ message: 'auth failed!'})
  }
};
