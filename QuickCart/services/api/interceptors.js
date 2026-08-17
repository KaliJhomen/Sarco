import client from './client';

function getTokenSource() {
  if (typeof window === 'undefined') return null;
  const ls = localStorage.getItem('auth-token');
  if (ls) return { key: 'auth-token', storage: localStorage };
  const ss = sessionStorage.getItem('auth-token');
  if (ss) return { key: 'auth-token', storage: sessionStorage };
  return null;
}

// Refresh token state
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token);
  });
  failedQueue = [];
};


// Interceptor de REQUEST
client.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Interceptor de RESPONSE
client.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return client(originalRequest);
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;
          try {
          const res = await client.post('/auth/refresh');
          const { token: newToken } = res.data || res;

          // Store in the same source as before
          const source = getTokenSource();
          if (source && newToken) {
            source.storage.setItem(source.key, newToken);
          }

          // Update authorization header
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // Process queued requests
          processQueue(null, newToken);

          // Retry original request
          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);

          // Refresh failed - clear auth and redirect
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-token');
            sessionStorage.removeItem('auth-token');

            if (!window.location.pathname.includes('/auth/login')) {
              window.location.href = '/auth/login';
            }
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Non-401 errors - just reject
      if (error.response) {
        const { status, data } = error.response;
        return Promise.reject({
          status,
          message: data?.message || 'Error en la petición',
          errors: data?.errors || null,
          data,
        });
      } else if (error.request) {
        return Promise.reject({
          status: 0,
          message: 'Error de red. No se pudo conectar al servidor.',
          errors: null,
        });
      } else {
        return Promise.reject({
          status: -1,
          message: error.message || 'Error desconocido',
          errors: null,
        });
      }
    }
);
export default client;