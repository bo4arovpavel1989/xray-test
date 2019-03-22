const db = require('./dbqueries');
const fs = require('fs');
const path = require('path');

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
    db.findAndStream('Test', fs.createWriteStream('dump/tests.json'), {}, '-_id'),
    db.findAndStream('Question', fs.createWriteStream('dump/questions.json'), {}, '-_id')
  ]).then(rep => res.json({ success: true }))
    .catch(err => res.status(500).json({ err: err.message }))
}

module.exports.downloadDump = function (req, res) {
  const { file } = req.params;
  const filename = path.join(__dirname, '../dump', file);

  fs.stat(filename, (err, stats) => {
    if (err) return res.status(500).json({ err: err.message })
    else if (stats.isFile()) res.download(filename)
    else res.status(404).end()
  });
};
