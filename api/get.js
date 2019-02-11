const db = require('./dbqueries')

module.exports.tests = function (req, res) {
  db.find('Test')
    .then(tests => res.json(tests))
    .catch(err => res.status(500).json({ err }))
};
