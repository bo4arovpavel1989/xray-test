const multer = require('multer');
const AuthService = require('./authservice');
const { slideStorage } = require('./config');
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

module.exports.checkAccess = function (req, res, next) {
  checkAccessMiddleware(req)
    .then(rep => {
      if (rep) next()
      else res.status(403).json({ forbidden: true })
    })
    .catch(err => res.status(500).json({ err }))
};

const uploadSlide = multer({ storage: multer.diskStorage(slideStorage) });

module.exports.uploadSlide = uploadSlide.fields([
  { name: 'slide' },
  { name: 'photo' }
]);
