const db = require('./dbqueries');

module.exports.question = function (req, res) {
  const { name } = req.params;

  db.del('Question', { name })
    .then(rep => res.json({ success: true }))
    .catch(err => res.status(500).json({ err: err.message }))
};
