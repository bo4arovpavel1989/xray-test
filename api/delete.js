const db = require('./dbqueries');

module.exports.object = function (req, res) {
  const { type, name } = req.params;
  console.log(type, name)

  db.del(type, { name })
    .then(rep => res.json({ success: true }))
    .catch(err => res.status(500).json({ err: err.message }))
};
