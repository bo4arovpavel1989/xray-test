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
export const setToken = token => {
  return localStorage.setItem('token', token);
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

/**
 * Comments for differen results
 */
export const comments = {
  right: 'Поздравляем! Правильный ответ.',
  yellow: 'Ошибка! Опасных предметов нет!',
  red1: 'Ошибка! Опасный предмет есть!',
  red2: 'Ошибка! Опасного предмета нет в обозначенной Вами области!',
  time: 'Время истекло!'
}
