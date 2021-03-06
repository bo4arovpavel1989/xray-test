const db = require('./dbqueries')
const { setToken } = require('./helpers')

class AuthService extends Object {
  constructor () {
    super()
  }

  login (cred) {
    return new Promise((resolve, reject) => {
      db.findOne('Admin', {
        loginUpperCase: cred.login.toUpperCase(),
        password: cred.password
      })
        .then(res => {
          if (!res) resolve({ auth: false, res: null })
          else resolve({
            auth: true,
            id: res._id,
            login: res.login,
            token: setToken(res)
          })
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  checkToken (data) {
    return new Promise((resolve, reject) => {
      db.findOne('Session', { token: data.token })
        .then(rep => {
          if (rep) resolve(true)
          else resolve(false)
        })
        .catch(err => reject(err))
    })
  }

  logoff (data) {
    return new Promise((resolve, reject) => {
      db.del('Session', data)
        .then(rep => resolve(rep))
        .catch(err => reject(err))
      })
  }
}

module.exports = AuthService;
