import { API_URL, defaultFetch, fileFetch } from './config'
import { handleResponse } from './helpers'

const postData = function (url, data) {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}/${url}`, defaultFetch('POST', data))
     .then(handleResponse)
     .then(rep => resolve(rep))
     .catch(err => reject(err))
  })
}

const getData = function (url, data) {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}/${url}`, defaultFetch('GET', data))
     .then(handleResponse)
     .then(rep => resolve(rep))
     .catch(err => reject(err))
  })
}

const postFile = function (url, data) {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}/${url}`, fileFetch(data))
     .then(handleResponse)
     .then(rep => resolve(rep))
     .catch(err => reject(err))
  })
}

export { postData, getData, postFile }
