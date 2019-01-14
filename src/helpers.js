/**
 * Fetch method helper makes json transformation
 * @param {object} response - response object got from server
 * @returns {Promise} - boolean represents if json operation success
 */
export const handleResponse = response => response.json().then(json => response.ok ? json : Promise.reject(json))

/**
 * Function saves access token in localStorage
 * @param {object} data - object that contains access token data (login, token, id)
 * @returns {null} - returns nothing if param wasnt defined
 */
export const setToken = data => {
  if (!data) return localStorage.setItem('token', null);

  return localStorage.setItem('token', data.token);
}

/**
 * Function get access token from localStorage
 * @returns {string} - if access token is stored in localStorage
 * @returns {boolean} - false boolean represents if is no access token
 */
export const getToken = () => {
  if (localStorage.getItem('token')) {
    return localStorage.getItem('token')
  }

  return false;
}
