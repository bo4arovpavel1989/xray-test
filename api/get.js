const db = require('./dbqueries');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

module.exports.tests = function (req, res) {
  db.find('Test')
    .then(tests => res.json(tests))
    .catch(err => res.status(500).json({ err: err.message }))
};

module.exports.question = function (req, res) {
  const { name } = req.params;

  db.findOne('Question', { name })
    .then(rep => res.json(rep))
    .catch(err => res.status(500).json({ err: err.message }))
}

module.exports.allQuestions = function (req, res) {
  db.find('Question', {}, 'name', { sort: { name: 1 } })
    .then(rep => res.json(rep))
    .catch(err => res.status(500).json({ err: err.message }))
};

module.exports.settings = function (req, res) {
  db.find('Settings', {})
    .then(rep => res.json(rep))
    .catch(err => res.status(500).json({ err: err.message }))
};

module.exports.allQuestionsForTest = function (req, res) {
  const { test } = req.params;
  const nameRegEx = new RegExp('^' + test + '_');

  db.find('Question', { name: { $regex: nameRegEx } }, null, { sort: { name: 1 } })
    .then(questions => res.json(questions))
    .catch(err => res.status(500).json({ err: err.message }))
};

module.exports.saveDb = function (req, res) {
  Promise.all([
    db.find('Test'),
    db.find('Question'),
    db.find('Settings')
  ]).then(rep => writeFile('dump/db.json', JSON.stringify(rep)))
    .then(rep => res.json({ success: true }))
    .catch(err => res.status(500).send(err.message))
}
