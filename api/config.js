module.exports.slideStorage = {
  destination: function (req, file, cb) {
    // For production change to public/images
    cb(null, 'api/images')
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
