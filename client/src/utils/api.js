import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
    withCredentials: true, // Send cookies with every request
});

// Request Interceptor to add Bearer token from localStorage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor to handle 401s
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token (uses httpOnly cookie)
                const res = await axios.post('http://localhost:5000/api/auth/refresh-token', {}, { withCredentials: true });

                if (res.status === 200) {
                    const newToken = res.data.token;
                    localStorage.setItem('token', newToken);

                    // Update header and retry
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Optionally logout user
                // localStorage.removeItem('token');
                // localStorage.removeItem('user');
                // window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
