const db = require('./dbqueries')

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
  db.find('Question', {}, 'name')
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
