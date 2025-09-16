export const TOKEN_KEY = 'app_token';

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}


export function createClientToken(username) {
  const payload = { username, iat: Date.now() };
  return btoa(JSON.stringify(payload));
}
