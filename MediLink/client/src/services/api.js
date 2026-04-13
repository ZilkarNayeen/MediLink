import { API_BASE_URL } from '../config.js'

/**
 * Centralized API helper. Wraps fetch with JSON parsing, error handling,
 * and optional Authorization header injection.
 *
 * @param {string}  endpoint  - Path relative to API_BASE_URL (e.g. '/auth/login')
 * @param {object}  options
 * @param {string}  [options.method='GET']
 * @param {object}  [options.body]        - Will be JSON.stringified
 * @param {string}  [options.token]       - Bearer token (added to Authorization header)
 * @param {object}  [options.headers]     - Additional headers
 * @returns {Promise<any>} Parsed JSON response
 * @throws {Error} With the server's error `message` or a generic fallback
 */
export async function apiFetch(endpoint, { method = 'GET', body, token, headers = {} } = {}) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`)
  }

  return data
}
