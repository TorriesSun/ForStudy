import { ParsedEvent, ReconnectInterval, createParser } from 'eventsource-parser';

import { getApiUrl } from '../request';

export const config = {
	runtime: 'edge'
};

export class MetatreeAIError extends Error {
	type: string;

	param: string;

	code: string;

	constructor(message: string, type: string, param: string, code: string) {
		super(message);
		this.name = 'MetatreeAIError';
		this.type = type;
		this.param = param;
		this.code = code;
	}
}

const MetatreeAIStream = async (payload: ISendMessagePayload, authorization: string | null) => {
	const { id, ...data } = payload;

	const res = await fetch(`${getApiUrl()}/api/conversations/${id}/sendMessage`, {
		headers: {
			'content-Type': 'application/json',
			...(authorization ? { Authorization: authorization } : {})
		},
		method: 'POST',
		body: JSON.stringify(data)
	});
	const encoder = new TextEncoder();
	const decoder = new TextDecoder();

	if (res.status !== 200) {
		const result = await res.json();
		if (typeof result.error === 'object') {
			throw new MetatreeAIError(
				result.error.message,
				result.error.type,
				result.error.param,
				result.error.code
			);
		} else {
			const message = decoder.decode(result?.value) || result.statusText || res.statusText;
			throw new Error(`${res.status}||${message}`);
		}
	}

	const stream = new ReadableStream({
		async start(controller) {
			const onParse = (event: ParsedEvent | ReconnectInterval) => {
				if (event.type === 'event') {
					const { data: eventData } = event;
					try {
						const json = JSON.parse(eventData || '{}');

						if (json.choices[0].finish_reason != null) {
							controller.close();
							return;
						}
						const text = json.choices[0].delta.content;
						const queue = encoder.encode(text);
						controller.enqueue(queue);
					} catch (e) {
						controller.error(e);
					}
				}
			};

			const parser = createParser(onParse);

			// eslint-disable-next-line no-restricted-syntax
			for await (const chunk of res.body as any) {
				parser.feed(decoder.decode(chunk));
			}
		}
	});

	return stream;
};

export default MetatreeAIStream;
