interface IMessage {
	id?: string;
	role: 'human' | 'ai';
	content: string;
}

interface IConversation {
	id: string;
	title: string;
	updatedAt: string;
	messages: IMessage[];
}

type TConversationInList = Pick<IConversation, 'id' | 'title' | 'updatedAt'>;

type TCreateConversationPayload = Pick<IConversation, 'title'>;

type TUpdateConversationPayload = Partial<Pick<IConversation, 'title'>> & { id: string };

interface ISendMessagePayload {
	id: string;
	message: {
		content: string;
		id?: string;
	};
}
