interface IChatHistory {
	id: string;
	sender: string;
	message: string;
}

interface IConversation {
	id: string;
	title: string;
	createdAt: string;
	updatedAt: string;
	chatHistory: IChatHistory[];
}

type TCreateConversationPayload = Pick<IConversation, 'title'>;

type TUpdateConversationPayload = Partial<Pick<IConversation, 'title'>> & { id: string };
