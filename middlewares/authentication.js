const {validateToken} = require('../services/authentication');

function authenticationMiddleware (cookieName){
  return (req, res, next) => {
    // console.log("Cookies:", req.cookies);
    const tokenCookieValue = req.cookies[cookieName];
    // console.log("Token found:", tokenCookieValue ? "Yes" : "No");
    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
    //   console.log(userPayload);
      req.user = userPayload;
    } catch (error) {}

    return next();
  };

}

module.exports = {
  authenticationMiddleware,
};