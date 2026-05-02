import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth-store';

interface RefreshResponse {
    accessToken: string;
}

const instance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_FETCH_URL,
    timeout: 30000,
    withCredentials: true, // 🔥 penting untuk refresh token via cookie
});

// REQUEST INTERCEPTOR
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().accessToken;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// REFRESH TOKEN LOGIC
let isRefreshing = false;
let failedQueue: {
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else if (token) prom.resolve(token);
    });
    failedQueue = [];
};

// RESPONSE INTERCEPTOR
instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        const status = error.response?.status;

        // ❌ bukan 401 → langsung lempar error
        if (status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // ❌ jangan refresh kalau login endpoint
        if (originalRequest.url?.includes('/login')) {
            return Promise.reject(error);
        }

        const { logout } = useAuthStore.getState();

        // HANDLE QUEUE

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: (token: string) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        resolve(instance(originalRequest));
                    },
                    reject,
                });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            // 🔥 endpoint refresh (sesuaikan backend kamu)
            const res = await axios.post<RefreshResponse>(
                `${process.env.NEXT_PUBLIC_FETCH_URL}/auth/token/refresh`,
                {},
                { withCredentials: true }
            );

            const newToken = res.data.accessToken;

            // update zustand
            useAuthStore.getState().login({
                accessToken: newToken,
                user: useAuthStore.getState().user!, // tetap pakai user lama
            });

            processQueue(null, newToken);

            if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }

            return instance(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);

            // logout kalau refresh gagal
            logout();

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

// RESPONSE HELPER
const responseBody = (response: AxiosResponse) => response.data;

// EXPORT API
const Fetch = {
    GET: <T = unknown>(url: string, config?: object) =>
        instance.get<T>(url, config).then(responseBody),

    POST: <T = unknown>(url: string, data?: object, config?: object) =>
        instance.post<T>(url, data, config).then(responseBody),

    PUT: <T = unknown>(url: string, data?: object, config?: object) =>
        instance.put<T>(url, data, config).then(responseBody),

    PATCH: <T = unknown>(url: string, data?: object, config?: object) =>
        instance.patch<T>(url, data, config).then(responseBody),

    DELETE: <T = unknown>(url: string, config?: object) =>
        instance.delete<T>(url, config).then(responseBody),
};

export default Fetch;
