/**
 * Fetch method helper makes json transformation
 * @param {object} response - response object got from server
 * @returns {Promise} - boolean represents if json operation success
 */
export const handleResponse = response => response.json().then(json => response.ok ? json : Promise.reject(json))
