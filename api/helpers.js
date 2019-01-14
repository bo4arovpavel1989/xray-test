const jwt = require('jsonwebtoken')
const secret = require('./credentials')
const { authService } = require('./authservice')

/**
 * Return JSON web token, based on response object
 * @param {object} res The response object.
 * @returns {string} The JSON web token generated on response data
 */
const setToken = res => jwt.sign({ login: res.login, pass: res.passwd, email: res.email, date: new Date() }, secret.secret)

module.exports.setToken = setToken

/**
 * Function that contains mutual logick for checkAccess middlewares
 * @param {object} req - request object
 * @returns {Promise} Promise object represents if access is granted
 */
module.exports.checkAccessMiddleware = function (req) {
  const cred = req.headers.token ? req.headers : req.body;

  return new Promise((resolve, reject) => {
    authService.checkToken(cred)
        .then(rep => resolve(rep))
        .catch(err => reject(err))
  })
}
