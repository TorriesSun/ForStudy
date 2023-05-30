import { IconCheck, IconCopy, IconEdit, IconRobot, IconTrash, IconUser } from '@tabler/icons-react';
import { FC, memo, useEffect, useRef, useState } from 'react';
import rehypeMathjax from 'rehype-mathjax';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import CodeBlock from '../Markdown/CodeBlock/CodeBlock';
import MemoizedReactMarkdown from '../Markdown/MemoizedReactMarkdown/MemoizedReactMarkdown';

import EChatRole from '@/constants/chat';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import {
	deleteMessageByMessageId,
	fetchMyConversationByIdAsync,
	selectConversationState
} from '@/store/slices/conversationSlice';
import { checkValidTime } from '@/utils/checkHelper';

export interface Props {
	message: IMessage;
	messageIndex: number;
	onEdit?: (editedMessage: IMessage) => void;
}

export const ChatMessage: FC<Props> = memo(({ message, messageIndex, onEdit }) => {
	const dispatch = useAppDispatch();
	const { currentConversation } = useAppSelector(selectConversationState);
	const messageIsStreaming = false;

	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [isTyping, setIsTyping] = useState<boolean>(false);
	const [messageContent, setMessageContent] = useState(message.content);
	const [messagedCopied, setMessageCopied] = useState(false);

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const toggleEditing = () => {
		setIsEditing(!isEditing);
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessageContent(event.target.value);
		if (textareaRef.current) {
			textareaRef.current.style.height = 'inherit';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	};

	const handleEditMessage = () => {
		if (message.content !== messageContent) {
			if (currentConversation && onEdit) {
				onEdit({ ...message, content: messageContent });
			}
		}
		setIsEditing(false);
	};

	const handleDeleteMessage = () => {
		if (!currentConversation || !message.id) return;

		if (checkValidTime(message.id)) {
			dispatch(fetchMyConversationByIdAsync(currentConversation.id));
		}

		dispatch(deleteMessageByMessageId(currentConversation.id, message.id));
	};

	const handlePressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !isTyping && !e.shiftKey) {
			e.preventDefault();
			handleEditMessage();
		}
	};

	const copyOnClick = () => {
		if (!navigator.clipboard) return;

		navigator.clipboard.writeText(message.content).then(() => {
			setMessageCopied(true);
			setTimeout(() => {
				setMessageCopied(false);
			}, 2000);
		});
	};

	useEffect(() => {
		setMessageContent(message.content);
	}, [message.content]);

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'inherit';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [isEditing]);

	return (
		<div
			className={`group md:px-4 ${
				message.role === EChatRole.AI
					? 'border-b border-black/10 bg-gray-50 text-gray-800 dark:border-gray-900/50 dark:bg-[#444654] dark:text-gray-100'
					: 'border-b border-black/10 bg-white text-gray-800 dark:border-gray-900/50 dark:bg-[#343541] dark:text-gray-100'
			}`}
			style={{ overflowWrap: 'anywhere' }}
		>
			<div className="relative m-auto flex p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
				<div className="min-w-[40px] text-right font-bold">
					{message.role === EChatRole.AI ? (
						<IconRobot size={30} />
					) : (
						<IconUser size={30} />
					)}
				</div>

				<div className="prose mt-[-2px] w-full dark:prose-invert">
					{message.role === EChatRole.HUMAN ? (
						<div className="flex w-full">
							{isEditing ? (
								<div className="flex w-full flex-col">
									<textarea
										ref={textareaRef}
										className="w-full resize-none whitespace-pre-wrap border-none dark:bg-[#343541]"
										value={messageContent}
										onChange={handleInputChange}
										onKeyDown={handlePressEnter}
										onCompositionStart={() => setIsTyping(true)}
										onCompositionEnd={() => setIsTyping(false)}
										style={{
											fontFamily: 'inherit',
											fontSize: 'inherit',
											lineHeight: 'inherit',
											padding: '0',
											margin: '0',
											overflow: 'hidden'
										}}
									/>

									<div className="mt-10 flex justify-center space-x-4">
										<button
											type="button"
											className="h-[40px] rounded-md bg-blue-500 px-4 py-1 text-sm font-medium text-white enabled:hover:bg-blue-600 disabled:opacity-50"
											onClick={handleEditMessage}
											disabled={messageContent.trim().length <= 0}
										>
											Save & Submit
										</button>
										<button
											type="button"
											className="h-[40px] rounded-md border border-neutral-300 px-4 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
											onClick={() => {
												setMessageContent(message.content);
												setIsEditing(false);
											}}
										>
											Cancel
										</button>
									</div>
								</div>
							) : (
								<div className="prose flex-1 whitespace-pre-wrap dark:prose-invert">
									{message.content}
								</div>
							)}

							{!isEditing && (
								<div className="ml-1 flex flex-col items-center justify-end gap-4 md:-mr-8 md:ml-0 md:flex-row md:items-start md:justify-start md:gap-1">
									<button
										type="button"
										className="invisible text-gray-500 hover:text-gray-700 focus:visible group-hover:visible dark:text-gray-400 dark:hover:text-gray-300"
										onClick={toggleEditing}
									>
										<IconEdit size={20} />
									</button>
									<button
										type="button"
										className="invisible text-gray-500 hover:text-gray-700 focus:visible group-hover:visible dark:text-gray-400 dark:hover:text-gray-300"
										onClick={handleDeleteMessage}
									>
										<IconTrash size={20} />
									</button>
								</div>
							)}
						</div>
					) : (
						<div className="flex flex-row">
							<MemoizedReactMarkdown
								className="prose flex-1 dark:prose-invert"
								remarkPlugins={[remarkGfm, remarkMath]}
								rehypePlugins={[rehypeMathjax]}
								components={{
									/* eslint-disable  react/no-unstable-nested-components */
									code({ node, inline, className, children, ...props }) {
										if (children.length) {
											if (children[0] === '▍') {
												return (
													<span className="mt-1 animate-pulse cursor-default">
														▍
													</span>
												);
											}

											children[0] = (children[0] as string).replace(
												'`▍`',
												'▍'
											);
										}

										const match = /language-(\w+)/.exec(className || '');

										return !inline ? (
											<CodeBlock
												key={Math.random()}
												language={(match && match[1]) || ''}
												value={String(children).replace(/\n$/, '')}
												{...props}
											/>
										) : (
											<code className={className} {...props}>
												{children}
											</code>
										);
									},
									table({ children }) {
										return (
											<table className="border-collapse border border-black px-3 py-1 dark:border-white">
												{children}
											</table>
										);
									},
									th({ children }) {
										return (
											<th className="break-words border border-black bg-gray-500 px-3 py-1 text-white dark:border-white">
												{children}
											</th>
										);
									},
									td({ children }) {
										return (
											<td className="break-words border border-black px-3 py-1 dark:border-white">
												{children}
											</td>
										);
									}
								}}
							>
								{`${message.content}${
									messageIsStreaming &&
									messageIndex === (currentConversation?.messages.length ?? 0) - 1
										? '`▍`'
										: ''
								}`}
							</MemoizedReactMarkdown>

							<div className="ml-1 flex flex-col items-center justify-end gap-4 md:-mr-8 md:ml-0 md:flex-row md:items-start md:justify-start md:gap-1">
								{messagedCopied ? (
									<IconCheck
										size={20}
										className="text-green-500 dark:text-green-400"
									/>
								) : (
									<button
										type="button"
										className="invisible text-gray-500 hover:text-gray-700 focus:visible group-hover:visible dark:text-gray-400 dark:hover:text-gray-300"
										onClick={copyOnClick}
									>
										<IconCopy size={20} />
									</button>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
});
ChatMessage.displayName = 'ChatMessage';
