const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const ROLES = 'roles';

/**
 * Manage the how Access Tokens are being stored and retreived from storage.
 *
 * Current implementation stores to localStorage. Local Storage should always be
 * accessed through this instace.
 **/
const TokenService = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  getRoles() {
    return JSON.parse(localStorage.getItem(ROLES));
  },

  saveToken(accessToken, roles) {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(ROLES, JSON.stringify(roles));
  },
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  saveRefreshToken(refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  removeRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export { TokenService };
