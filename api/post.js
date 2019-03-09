const db = require('./dbqueries');
const { sizeOf, getSettingsQueryArray } = require('./helpers');
const AuthService = require('./authservice');
const authService = new AuthService();

module.exports.login = function (req, res) {
  const cred = req.body

  authService.login(cred)
    .then(rep => {
      if (rep.auth) {
        return Promise.all([
          rep,
          db.update('Session', { login: cred.login }, { token: rep.token }, { upsert: true })
        ])
      }

      // Made array coz i use array in first case if rep.auth === true
      return [{ auth: false }]
    })
    // Send reps[0] - only result of auth
    .then(reps => res.json(reps[0]))
    .catch(err => res.status(500).json({ err: err.message }))
}

module.exports.logoff = function (req, res) {
  const cred = req.body

  authService.logoff(cred)
    .then(rep => {
      res.end()
    })
    .catch(err => res.status(500).json({ err }))
}

module.exports.preupload = function (req, res) {
  const name = req.body.question;
  let dangerPicture = '';

  if (req.files.photo) {
    dangerPicture = req.files.photo[0].destination;
    // To make public/images/file -> images/file
    dangerPicture = dangerPicture.split('/').slice(1).join('/');
    dangerPicture = '/' + dangerPicture + '/' + req.files.photo[0].filename;
  }

  db.update('Question', { name }, { dangerPicture }, { upsert: true })
    .then(rep => {
      return sizeOf(req.files.slide[0].path)
    })
    .then(dimensions => res.json(dimensions))
    .catch(err => res.status(500).json(err.message))
};

module.exports.saveQuestion = function (req, res) {
  const question = req.body;
  const { name } = question;

  db.update('Question', { name }, question, { upsert: true })
    .then(rep => res.json({ success: true }))
    .catch(err => res.status(500).json(err.message))
};

module.exports.test = function (req, res) {
  const { name } = req.body;
  const nameRegEx = new RegExp('^' + name + '_');

  db.find('Question', { name: { $regex: nameRegEx } }, 'name -_id', { sort: { name: 1 } })
    .then(questions => {
      // Making questions array [{name}] -> array of strings [name]
      questions.forEach((q, i) => {
        questions[i] = q.name;
      });

      return db.update('Test', { name }, { questions }, { upsert: true })
    })
    .then(rep => res.json({ success: true }))
    .catch(err => res.status(500).json(err.message))
};

module.exports.settings = function (req, res) {
  const { settings } = req.body;
  const queries = getSettingsQueryArray(settings);

  Promise.all(queries)
         .then(rep => res.json({ success: true }))
         .catch(err => res.status(500).json(err.message))
};
