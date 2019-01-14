const { authService } = require('./authservice')
const db = require('./dbqueries')

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
      return Promise.resolve([{ auth: false }])
    })
    // Send reps[0] - only result of auth
    .then(reps => res.json(reps[0]))
    .catch(err => {
      res.status(500).json({ err })
    })
}

module.exports.logoff = function (req, res) {
  const cred = req.body

  authService.logoff(cred)
    .then(rep => {
      res.end()
    })
    .catch(err => {
      res.status(500).json({ err })
    })
}
