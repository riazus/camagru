import { API_BASE_URL } from '../config';

export const usmApi = {
  'GET': async (url) => {
    return await fetch(`${API_BASE_URL + url}`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
  },
  'POST': async (url, body) => {
    return await fetch(`${API_BASE_URL + url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });  
  }
}
