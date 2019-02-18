const jwt = require('jsonwebtoken');
const secret = require('./credentials');
const sizeOfCallback = require('image-size');

/**
 * Return JSON web token, based on response object
 * @param {object} res The response object.
 * @returns {string} The JSON web token generated on response data
 */
const setToken = res => jwt.sign({ login: res.login, pass: res.passwd, email: res.email, date: new Date() }, secret.secret)

module.exports.setToken = setToken

const sizeOf = function (file) {
  return new Promise((resolve, reject) => {
      sizeOfCallback(file, (err, dimensions) => {
        if (!err) resolve(dimensions)
        else reject(err)
      })
  })
};

module.exports.sizeOf = sizeOf;
