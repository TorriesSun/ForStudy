import request from '@/utils/request';

export const fetchMyConversations = async () =>
	request({
		method: 'GET',
		url: '/api/conversations'
	});

export const fetchMyConversationById = async (id: string) =>
	request({
		method: 'GET',
		url: `/api/conversations/${id}`
	});

export const createConversationByUser = async (payload: TCreateConversationPayload) =>
	request({
		method: 'POST',
		url: '/api/conversations',
		data: payload
	});

export const updateConversationById = async ({ id, ...data }: TUpdateConversationPayload) =>
	request({
		method: 'PATCH',
		url: `/api/conversations/${id}`,
		data
	});

export const deleteConversationById = async (id: string) =>
	request({
		method: 'DELETE',
		url: `/api/conversations/${id}`
	});

export default fetchMyConversations;
