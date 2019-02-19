const postReq = require('./post')
const getReq = require('./get')
const deleteReq = require('./delete')
const middleware = require('./middleware')

const getRequests = [
  {
    url: '/tests',
    middleware: [],
    callback: getReq.tests
  },
  {
    url: '/questions',
    middleware: middleware.checkAccess,
    callback: getReq.allQuestions
  },
  {
    url: '/question/:name',
    middleware: [],
    callback: getReq.question
  }
]

const postRequests = [
  {
    url: '/login',
    middleware: [],
    callback: postReq.login
  },
  {
    url: '/preupload',
    middleware: [
      middleware.checkAccess,
      middleware.uploadSlide
    ],
    callback: postReq.preupload
  },
  {
    url: '/savequestion',
    middleware: middleware.checkAccess,
    callback: postReq.saveQuestion
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
