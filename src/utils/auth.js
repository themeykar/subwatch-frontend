export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const exp = decodedPayload.exp;
    if (!exp) return false;
    // Check if token is expired (with 10-second buffer)
    return Date.now() / 1000 >= exp - 10;
  } catch {
    return true;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  if (!token || token === 'null' || token === 'undefined') {
    return false;
  }
  
  if (isTokenExpired(token)) {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken || refreshToken === 'null' || refreshToken === 'undefined' || isTokenExpired(refreshToken)) {
      // Both tokens are expired/invalid, clear them to prevent stale state issues
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return false;
    }
    // Access token is expired but refresh token is still valid.
    // The Axios API interceptor will seamlessly refresh it on the next request.
    return true;
  }
  
  return true;
};

export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const signout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
};
