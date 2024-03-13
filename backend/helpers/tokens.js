const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

/** return signed JWT from user data. */

function createToken(user) {
  console.assert(
    user.isAdmin !== undefined,
    "createToken passed user without isAdmin property"
  );

  let payload = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    status: user.status,
    isAdmin: user.isAdmin || false,
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
