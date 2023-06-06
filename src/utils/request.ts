import axios, { AxiosRequestConfig } from 'axios';

import { DEVELOPMENT_API_URL, PRODUCTION_API_URL, UAT_API_URL } from '@/constants/apiUrl';
import { PRODUCTION, UAT } from '@/constants/env';
import { AUTH } from '@/constants/storeLocation';
import { checkCSR } from '@/utils/checkHelper';
import { get as storeGet } from '@/utils/storageHelper';

export const getApiUrl = () => {
	const environment = process.env.NODE_ENV;
	if (environment === PRODUCTION) {
		if (process.env.NEXT_PUBLIC_NEXT_ENV === UAT) return UAT_API_URL;
		return PRODUCTION_API_URL;
	}
	return DEVELOPMENT_API_URL;
};

interface IRequest {
	method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
	url: string;
}
const baseURL = getApiUrl();
const timeout = 30000;

const axiosInstance = axios.create({
	baseURL,
	timeout
});

axiosInstance.interceptors.response.use(
	response => Promise.resolve(response),
	error => {
		const { response } = error;
		const { status } = response;
		if (status === 401 || status === 403) {
			if (checkCSR()) {
				localStorage.clear();
				if (window.location.pathname !== '/login') window.location.pathname = '/login';
			}
		}
		return Promise.reject(response || error);
	}
);

export default function request(options: AxiosRequestConfig & IRequest) {
	const auth: TAuth = storeGet(AUTH);
	return axiosInstance({
		...options,
		headers: {
			Authorization: checkCSR() ? `JWT ${auth.token || ''}` : ''
		}
	})
		.then(response => response)
		.catch(error => error);
}
