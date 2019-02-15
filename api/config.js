module.exports.slideStorage = {
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    let ext;

    switch (file.mimetype) {
                case 'image/jpeg':
                    ext = '.jpeg';
                    break;
                case 'image/png':
                    ext = '.png';
                    break;
            }
    cb(null, `${req.body.question}_${file.fieldname}${ext}`)
  }
}
