import { getToken } from './helpers'

export const API_URL = 'http://109.120.170.187:9245'

export const defaultFetch = function (method = 'GET', body) {
  const configFetch = {
      method,
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'token': getToken()
      }
    }

  if (body) Object.assign(configFetch, { body: JSON.stringify(body) })

  return configFetch
}

export const fileFetch = function (body) {
  return {
      method: 'POST',
      mode: 'cors',
      body: body,
      headers: {
        'token': getToken()
      }
    }
}

export const downLoadFetch = function () {
  return {
    method: 'GET',
    mode: 'cors',
    headers: {
      'token': getToken()
    }
  }
}
