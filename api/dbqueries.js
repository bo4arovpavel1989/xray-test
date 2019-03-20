const models = require('./models')

const dbQueries = {
  find (schema, val = {}, select = null, opt = {}) {
    return new Promise((resolve, reject) => {
      models[schema].find(val, select, opt, (err, rep) => {
        if (err) reject(err)
        else resolve(rep)
      })
    })
  },
  findAndStream (schema, dest, val = {}, select = null, opt = {}) {
    return new Promise((resolve, reject) => {
      const stream = models[schema].find(val, select, opt).stream();

      stream.on('data', (chunk) => {
        dest.write(JSON.stringify(chunk) + '\n');
      })
      stream.on('error', reject);
      stream.on('close', resolve);
    })
  },
  findBy (schema, val, sort, skip, limit, select) {
    return new Promise((resolve, reject) => {
      models[schema].find(val).sort(sort)
        .skip(skip)
        .limit(limit)
        .select(select)
        .exec((err, rep) => {
          if (err) reject(err)
          else resolve(rep)
        })
    })
  },
  findOne (schema, val = {}, opt) {
    return new Promise((resolve, reject) => {
      models[schema].findOne(val, opt, (err, rep) => {
        if (err) reject(err)
        else if (rep) resolve(rep.toObject())
        else resolve(rep)
      })
    })
  },
  update (schema, get, set, opt) {
    return new Promise((resolve, reject) => {
      models[schema].updateMany(get, set, opt).exec((err, rep) => {
        if (err) reject(err)
        else resolve(rep)
      })
    })
  },
  del (schema, val) {
    return new Promise((resolve, reject) => {
      models[schema].deleteOne(val, err => {
        if (err) reject(err)
        else resolve()
      })
    })
  },
  create (schema, val) {
    return new Promise((resolve, reject) => new models[schema](val).save(err => {
        if (err) reject(err)
        else resolve(true)
      }))
  },
  count (schema, val) {
    return new Promise((resolve, reject) => {
      models[schema].countDocuments(val, (err, rep) => {
        if (err) reject(err)
        else resolve(rep)
      })
    })
  }
}

module.exports = dbQueries
