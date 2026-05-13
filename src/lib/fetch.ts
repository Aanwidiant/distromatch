import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import { User } from '@/types';

interface RefreshResponse {
    accessToken: string;
    user: User;
}

const instance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_FETCH_URL,
    timeout: 30000,
    withCredentials: true,
});

instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

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

instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        const status = error.response?.status;

        if (status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (originalRequest.url?.includes('/login')) {
            return Promise.reject(error);
        }

        const { logout, login } = useAuthStore.getState();

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: () => resolve(instance(originalRequest)),
                    reject,
                });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const res = await axios.post<RefreshResponse>(
                `${process.env.NEXT_PUBLIC_FETCH_URL}/auth/token/refresh`,
                {},
                { withCredentials: true }
            );

            const user = res.data.user;

            login(user);

            processQueue(null, 'success');

            return instance(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            logout();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

const responseBody = (response: AxiosResponse) => response.data;

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
