import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { HttpClient, HttpClientConfig, HttpResponse } from '../interface/http_client_interface';

export class AxiosHttpClient implements HttpClient {
    private client: AxiosInstance;

    constructor(config?: HttpClientConfig) {
        this.client = axios.create(config);
    }

    get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<HttpResponse<T>> {
        return this.client.get(url, config);
    }

    post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<HttpResponse<T>> {
        return this.client.post(url, data, config);
    }

    put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<HttpResponse<T>> {
        return this.client.put(url, data, config);
    }

    delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<HttpResponse<T>> {
        return this.client.delete(url, config);
    }

    request<T = unknown>(config: AxiosRequestConfig): Promise<HttpResponse<T>> {
        return this.client.request(config);
    }
}