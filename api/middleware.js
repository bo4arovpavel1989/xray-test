const multer = require('multer')
const config = require('./config');
const uploadSlide = multer({ storage: multer.diskStorage(config.slideStorage) });

const AuthService = require('./authservice');
const authService = new AuthService();

/**
 * Function that contains mutual logick for checkAccess middlewares
 * @param {object} req - request object
 * @returns {Promise} Promise object represents if access is granted
 */
const checkAccessMiddleware = function (req) {
  const cred = req.headers.token ? req.headers : req.body;

  return new Promise((resolve, reject) => {
    authService.checkToken(cred)
        .then(rep => resolve(rep))
        .catch(err => reject(err))
  })
}

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

module.exports.uploadSlide = uploadSlide.fields([
  { name: 'slide' },
  { name: 'photo' }
]);
