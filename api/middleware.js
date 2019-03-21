const multer = require('multer');
const AuthService = require('./authservice');
const { slideStorage, dbStorage } = require('./config');
const authService = new AuthService();

/**
 * Middleware gets reactRouter handled routes and redirect to '/'
 * in order to avoid 'can not get' message from express
 */
module.exports.reactRoutes = function (req, res, next) {
  const reactRoutes = ['/test', '/admin', '/create/test', '/create/question'];
  const { originalUrl, method } = req;

  if (reactRoutes.includes(originalUrl) && method === 'GET') return res.redirect('/');

  return next();
}

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

const uploadDb = multer({ storage: multer.diskStorage(dbStorage) });

module.exports.uploadDb = uploadDb.fields([
  { name: 'tests' },
  { name: 'questions' }
]);
