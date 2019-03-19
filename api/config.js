module.exports.slideStorage = {
  destination: function (req, file, cb) {
    // For production change to dist/images
    cb(null, 'dist/images')
  },
  filename: function (req, file, cb) {
    let ext;

    switch (file.mimetype) {
                case 'image/jpeg':
                    ext = '.jpg';
                    break;
                case 'image/jpg':
                    ext = '.jpg';
                    break;
                case 'image/png':
                    ext = '.png';
                    break;
            }
    cb(null, `${req.body.question}_${file.fieldname}${ext}`)
  }
}

module.exports.dbStorage = {
  destination: function (req, file, cb) {
    cb(null, 'dump')
  },
  filename: function (req, file, cb) {
    cb(null, `db.json`)
  }
}
