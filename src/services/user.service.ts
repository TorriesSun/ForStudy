import request from '@/utils/request';

export const fetchMe = async () =>
	request({
		method: 'GET',
		url: '/api/users/me'
	});

export default fetchMe;
