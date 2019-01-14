const postReq = require('./post')
const getReq = require('./get')
const deleteReq = require('./delete')
const middleware = require('./middleware')

const getRequests = [
]

const postRequests = [
  {
    url: '/login',
    middleware: middleware.noMiddleware,
    callback: postReq.login
  }

]

const deleteRequests = [

]

const router = function (app) {
  getRequests.forEach(request => {
    app.get(request.url, request.middleware, request.callback)
  })
  postRequests.forEach(request => {
    app.post(request.url, request.middleware, request.callback)
  })
  deleteRequests.forEach(request => {
    app.delete(request.url, request.middleware, request.callback)
  })
}

module.exports = router
