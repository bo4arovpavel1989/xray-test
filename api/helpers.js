const jwt = require('jsonwebtoken');
const secret = require('./credentials');
const sizeOfCallback = require('image-size');
const db = require('./dbqueries');

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

/**
 * Function generates array of db update queries for settings
 * to use it in Promise.all
 * @params {Array} settings - got from client
 * @returns {Array} - db update queries
 */
const getSettingsQueryArray = function (settings) {
  const settingsQueryArray = [];

  settings.forEach(tune => {
    const { name } = tune;

    settingsQueryArray.push(db.update('Settings', { name }, tune))
  });

  return settingsQueryArray;
}

module.exports.getSettingsQueryArray = getSettingsQueryArray;
