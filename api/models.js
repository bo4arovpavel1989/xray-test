const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/xray-test')
mongoose.Promise = global.Promise

let models = {}

models.Admin = new mongoose.Schema({
  login: { type: String },
  loginUpperCase: { type: String },
  password: { type: String }
})

models.Session = new mongoose.Schema({
  login: { type: String, required: true },
  token: { type: String, require: true }
})

models.Test = new mongoose.Schema({
  name: { type: String },
  questions: { type: Array }
})

models.Question = new mongoose.Schema({
  name: { type: String },
  imgPath: { type: String },
  isDanger: { type: String },
  dangerPicture: { type: String },
  dangerZones: { type: Array },
  dimensions: { type: Object }
})

models.Settings = new mongoose.Schema({
  description: { type: String },
  type: { type: String },
  name: { type: String },
  value: { type: {} }
})

for (let schema of Object.keys(models)) {
  models[schema] = mongoose.model(schema.toLowerCase(), models[schema])
}

module.exports = models

module.exports.dropTestData = function () {
  return new Promise((resolve, reject) => {
    Promise.all([
      mongoose.connection.dropCollection('tests'),
      mongoose.connection.dropCollection('questions')
    ])
    .then(resolve)
    .catch(reject)
  })
}
