import request from '@/utils/request';

export const login = async (payload: ILoginPayload) =>
	request({
		method: 'POST',
		url: '/api/users/login',
		data: payload
	});

export const logout = async () =>
	request({
		method: 'POST',
		url: '/api/users/logout'
	});
