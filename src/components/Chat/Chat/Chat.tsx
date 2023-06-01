import { last } from 'lodash';
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import ChatInput from './components/ChatInput';
import ChatLoader from './components/ChatLoader/ChatLoader';
import MemoizedChatMessage from './components/MemoizedChatMessage/MemoizedChatMessage';
import EChatRole from '@/constants/chat';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { sendMessageByConversationId } from '@/services/conversation.service';
import {
	addMessageToCurrentConversation,
	fetchMyConversationByIdAsync,
	selectConversationState,
	updateConversation,
	updateCurrentConversation
} from '@/store/slices/conversationSlice';
import { checkValidTime } from '@/utils/checkHelper';
import { throttle } from '@/utils/data/throttle';

interface Props {
	stopConversationRef: MutableRefObject<boolean>;
}

const Chat = ({ stopConversationRef }: Props) => {
	const dispatch = useAppDispatch();
	const { currentConversation, currentConversationStatus } =
		useAppSelector(selectConversationState);

	const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(false);
	const [messageIsStreaming, setMessageIsStreaming] = useState<boolean>(false);
	const [showScrollDownButton, setShowScrollDownButton] = useState<boolean>(false);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const getLastHumanMessage = (messages: IMessage[]) => {
		return last(messages.filter((message: IMessage) => message.role === EChatRole.HUMAN));
	};

	const handleScroll = () => {
		if (chatContainerRef.current) {
			const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
			const bottomTolerance = 30;

			if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
				setAutoScrollEnabled(false);
				setShowScrollDownButton(true);
			} else {
				setAutoScrollEnabled(true);
				setShowScrollDownButton(false);
			}
		}
	};

	const handleScrollDown = () => {
		chatContainerRef.current?.scrollTo({
			top: chatContainerRef.current.scrollHeight,
			behavior: 'smooth'
		});
	};

	const scrollDown = () => {
		if (autoScrollEnabled) {
			messagesEndRef.current?.scrollIntoView(true);
		}
	};
	const throttledScrollDown = throttle(scrollDown, 250);

	useEffect(() => {
		throttledScrollDown();
	}, [throttledScrollDown]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setAutoScrollEnabled(entry.isIntersecting);
				if (entry.isIntersecting) {
					textareaRef.current?.focus();
				}
			},
			{
				root: null,
				threshold: 0.5
			}
		);
		const messagesEndElement = messagesEndRef.current;
		if (messagesEndElement) {
			observer.observe(messagesEndElement);
		}
		return () => {
			if (messagesEndElement) {
				observer.unobserve(messagesEndElement);
			}
		};
	}, [messagesEndRef]);

	const handleSend = useCallback(
		// If message has an id, it means the message is required to regenerated
		async (message: IMessage) => {
			if (currentConversation) {
				const { content } = message;
				if (message.id) {
					// delete the message and the ones that come after
					const messageIndex = currentConversation.messages.findIndex(
						item => item.id === message.id
					);
					if (messageIndex < 0) return;
					const retainedMessages = currentConversation.messages.slice(0, messageIndex);
					// update messages in store
					dispatch(
						updateCurrentConversation({
							messages: retainedMessages
						})
					);
				}
				// create human message object
				const tempHumanMessageId = Date.now().toString();
				const humanMessage: IMessage = {
					...message,
					id: tempHumanMessageId
				};
				// add the human message to store
				dispatch(addMessageToCurrentConversation(humanMessage));

				setLoading(true);
				setMessageIsStreaming(true);

				// Send the human message to server
				const response = await sendMessageByConversationId({
					id: currentConversation.id,
					message: {
						content,
						// checkValidTime is used to check if the message is a new message or a regenerated one
						...(message.id && !checkValidTime(message.id) ? { id: message.id } : {})
					}
				});

				setMessageIsStreaming(false);
				setLoading(false);

				// Update conversation title
				if (currentConversation.messages?.length === 0) {
					const customTitle =
						content.length > 30 ? `${content.substring(0, 30)}...` : content;
					dispatch(
						updateConversation({
							id: currentConversation.id,
							title: customTitle
						})
					);
				}

				// update new messages with the ai response to store
				if (response.status === 200) {
					dispatch(
						updateCurrentConversation({
							messages: response.data
						})
					);
				} else {
					if (response.status === 406) {
						toast.error('对话字数已超出限制，请开启新对话。');
					}
					dispatch(fetchMyConversationByIdAsync(currentConversation.id));
				}
			}
		},
		[currentConversation, stopConversationRef]
	);

	if (!currentConversation || currentConversationStatus !== 'idle') return null;

	return (
		<div className="relative flex-1 overflow-hidden bg-white dark:bg-[#343541]">
			<div
				className="max-h-full overflow-x-hidden"
				ref={chatContainerRef}
				onScroll={handleScroll}
			>
				{currentConversation && (
					<div className="sticky top-0 z-10 hidden justify-center border border-b-neutral-300 bg-neutral-100 py-3 text-sm font-semibold text-neutral-500 sm:flex">
						{currentConversation?.title}
					</div>
				)}
				{currentConversation?.messages?.length === 0 ? null : (
					<>
						{currentConversation?.messages?.map((message, index) => (
							<MemoizedChatMessage
								key={message.id}
								message={message}
								messageIndex={index}
								onEdit={editedMessage => {
									// discard edited message and the ones that come after then resend
									handleSend(editedMessage);
								}}
							/>
						))}

						{loading && <ChatLoader />}

						<div className="h-[162px] bg-white" ref={messagesEndRef} />
					</>
				)}
			</div>

			<ChatInput
				textareaRef={textareaRef}
				onSend={handleSend}
				onScrollDownClick={handleScrollDown}
				onRegenerate={() => {
					const lastHumanMessage = getLastHumanMessage(currentConversation.messages);
					if (lastHumanMessage) {
						handleSend(lastHumanMessage);
					}
				}}
				showScrollDownButton={showScrollDownButton}
				messageIsStreaming={messageIsStreaming}
			/>
		</div>
	);
};

export default Chat;
