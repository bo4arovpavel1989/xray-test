const { checkAccessMiddleware } = require('./helpers');

module.exports.noMiddleware = function (req, res, next) {
  return next()
}

module.exports.checkAccess = function (req, res, next) {
  checkAccessMiddleware(req)
    .then(rep => {
      if (rep) next()
      else res.status(403).json({ forbidden: true })
    })
    .catch(err => res.status(500).json({ err }))
};
