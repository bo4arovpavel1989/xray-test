module.exports.noMiddleware = function(req, res, next){
  return next();
}
