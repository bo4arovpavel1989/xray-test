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
  db.find('Question', {}, 'name -_id')
    .then(rep => res.json(rep))
    .catch(err => res.status(500).json({ err: err.message }))
};
