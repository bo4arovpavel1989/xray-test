import { getToken } from './helpers'

export const API_URL = 'http://localhost:3001'

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
