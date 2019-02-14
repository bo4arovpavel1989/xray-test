module.exports.slideStorage = {
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    cb(null, `${req.body.question}_${file.fieldname}.jpg`)
  }
}
