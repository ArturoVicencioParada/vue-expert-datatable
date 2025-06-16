import { AxiosRequestConfig } from 'axios';

export interface HttpResponse<T = unknown> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: AxiosRequestConfig;
}

export interface HttpClientConfig {
    baseURL?: string;
    headers?: Record<string, string>;
    timeout?: number;
    withCredentials?: boolean;
}

export interface HttpClient {
    get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<HttpResponse<T>>;
    post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<HttpResponse<T>>;
    put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<HttpResponse<T>>;
    delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<HttpResponse<T>>;
    request<T = unknown>(config: AxiosRequestConfig): Promise<HttpResponse<T>>;
}

export interface HttpClientFactory {
    create(config?: HttpClientConfig): HttpClient;
}
