import axios, { AxiosResponse } from 'axios';
import { URLS } from './constants';

export async function requestDeployment<T>(data: any, config = {}): Promise<AxiosResponse<T>> {
    try {
        const url = import.meta.env.VITE_BASE + URLS.DEPLOY;
        console.log(`url ::: `, url);
        const response = await axios.post<T>(url, data, config);
        return response;
    } catch (error) {
        throw error;
    }
}