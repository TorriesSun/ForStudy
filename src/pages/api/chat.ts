import MetatreeAIStream from '@/utils/server';

export const config = {
	runtime: 'edge',
	unstable_allowDynamic: [
		'/node_modules/lodash/**' // use a glob to allow anything in the function-bind 3rd party module
	]
};

const handler = async (req: Request): Promise<Response> => {
	try {
		const body = (await req.json()) as ISendMessagePayload;
		const authorization = req.headers.get('Authorization');

		const stream = await MetatreeAIStream(body, authorization);

		return new Response(stream);
	} catch (error: any) {
		return new Response('Error', { status: +error.code || 500, statusText: error.message });
	}
};

export default handler;
