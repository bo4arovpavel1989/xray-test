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
  number: { type: Number },
  questions: { type: Array }
})

models.Question = new mongoose.Schema({
  name: { type: String },
  background: { type: String },
  isSafe: { type: Boolean },
  dangerPicture: { type: String },
  dangerArea: { type: Array }
})

for (let schema of Object.keys(models)) {
  models[schema] = mongoose.model(schema.toLowerCase(), models[schema])
}

module.exports = models
