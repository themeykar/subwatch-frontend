export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const signout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
};
