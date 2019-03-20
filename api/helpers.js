const jwt = require('jsonwebtoken');
const fs = require('fs');
const split = require('split2');
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

/**
  * Function creates read stream of json file and saves every entry to db collection
  * @param {String} file - path to file
  * @param {String} collection - name of collection
  * @returns {Promise} representing operation status
  */
const restoreCollection = function (file, collection) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
     .pipe(split())
     .on('data', function (line) {
       try {
         const entry = JSON.parse(line);

         db.create(collection, entry)
           .then(resolve)
           .catch(reject)
       } catch (e) {
         reject(e)
       }
     })
  })
}

/**
  * Function reads json files  and restores db from it
  * @returns {Promise} representing operation status
  */
const restoreTestdata = function () {
  return new Promise((resolve, reject) => {
    Promise.all([
      restoreCollection('Question', 'restore/questions.json'),
      restoreCollection('Test', 'restore/tests.json')
    ]).then(resolve)
      .catch(reject)
  })
}

module.exports.restoreTestdata = restoreTestdata;
