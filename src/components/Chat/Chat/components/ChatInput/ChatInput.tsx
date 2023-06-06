import { IconArrowDown, IconLoader, IconRepeat, IconSend } from '@tabler/icons-react';
import { KeyboardEvent, MutableRefObject, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import EChatRole from '@/constants/chat';
import { useAppSelector } from '@/hooks/useRedux';
import { selectConversationState } from '@/store/slices/conversationSlice';
import { isMobile } from '@/utils/validator';

interface Props {
	onSend: (message: IMessage) => void;
	onRegenerate: () => void;
	onScrollDownClick: () => void;
	stopConversationRef: MutableRefObject<boolean>;
	textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
	showScrollDownButton: boolean;
	messageIsStreaming: boolean;
}

const ChatInput = ({
	onSend,
	onRegenerate,
	onScrollDownClick,
	stopConversationRef,
	textareaRef,
	showScrollDownButton,
	messageIsStreaming
}: Props) => {
	const { currentConversation } = useAppSelector(selectConversationState);

	const [content, setContent] = useState<string>();
	const [isTyping, setIsTyping] = useState<boolean>(false);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = e.target;
		const maxLength = 2000;

		if (maxLength && value.length > maxLength) {
			toast.error(
				`Message limit is ${maxLength} characters. You have entered ${value.length} characters.`
			);
			return;
		}

		setContent(value);
	};

	const handleSend = () => {
		if (messageIsStreaming) {
			return;
		}

		if (!content) {
			toast('Please enter a message');
			return;
		}

		onSend({
			content,
			role: EChatRole.HUMAN
		});
		setContent('');

		if (window.innerWidth < 640 && textareaRef && textareaRef.current) {
			textareaRef.current.blur();
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !isTyping && !isMobile() && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleStopConversation = () => {
		stopConversationRef.current = true;
		setTimeout(() => {
			stopConversationRef.current = false;
		}, 1000);
	};

	useEffect(() => {
		if (textareaRef && textareaRef.current) {
			textareaRef.current.style.height = 'inherit';
			textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
			textareaRef.current.style.overflow = `${
				textareaRef?.current?.scrollHeight > 400 ? 'auto' : 'hidden'
			}`;
		}
	}, [content]);

	return (
		<div className="absolute bottom-0 left-0 w-full border-transparent bg-gradient-to-b from-transparent via-white to-white pt-6 md:pt-2">
			<div className="mx-2 mt-4 flex flex-row gap-3 last:mb-2 md:mx-4 md:mt-[52px] md:last:mb-6 lg:mx-auto lg:max-w-3xl">
				{messageIsStreaming && (
					<button
						type="button"
						className="absolute inset-x-0 top-0 mx-auto mb-3 flex w-fit items-center gap-3 rounded border border-neutral-200 bg-white px-4 py-2 text-black hover:opacity-50 md:mb-0 md:mt-2"
						onClick={handleStopConversation}
					>
						<IconLoader size={16} /> 停止生成
					</button>
				)}

				{!messageIsStreaming &&
					currentConversation &&
					currentConversation.messages?.length > 0 && (
						<button
							type="button"
							className="absolute inset-x-0 top-0 mx-auto mb-3 flex w-fit items-center gap-3 rounded border border-neutral-200 bg-white px-4 py-2 text-black hover:opacity-50 md:mb-0 md:mt-2"
							onClick={onRegenerate}
						>
							<IconRepeat size={16} /> 重新生成
						</button>
					)}

				<div className="relative mx-2 flex w-full grow flex-col rounded-md border border-black/10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.10)] sm:mx-4">
					<textarea
						ref={textareaRef}
						className="m-0 w-full resize-none border-0 bg-transparent p-0 py-2 pl-4 pr-8 text-black md:py-3"
						style={{
							resize: 'none',
							bottom: `${textareaRef?.current?.scrollHeight}px`,
							maxHeight: '400px',
							overflow: `${
								textareaRef.current && textareaRef.current.scrollHeight > 400
									? 'auto'
									: 'hidden'
							}`
						}}
						placeholder="请输入..."
						value={content}
						rows={1}
						onCompositionStart={() => setIsTyping(true)}
						onCompositionEnd={() => setIsTyping(false)}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
					/>

					<button
						type="button"
						className="absolute right-2 top-2 rounded-sm p-1 text-neutral-800 opacity-60 hover:bg-neutral-200 hover:text-neutral-900 "
						onClick={handleSend}
					>
						{messageIsStreaming ? (
							<div className="h-4 w-4 animate-spin rounded-full border-t-2 border-neutral-800 opacity-60" />
						) : (
							<IconSend size={18} />
						)}
					</button>

					{showScrollDownButton && (
						<div className="absolute bottom-12 right-0 lg:-right-10 lg:bottom-0">
							<button
								type="button"
								className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-300 text-gray-800 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								onClick={onScrollDownClick}
							>
								<IconArrowDown size={18} />
							</button>
						</div>
					)}
				</div>
			</div>
			<div className="px-3 pb-3 pt-2 text-center text-[12px] text-black/50 dark:text-white/50 md:px-4 md:pb-6 md:pt-3">
				<a
					href="https://localhost:3000"
					target="_blank"
					rel="noreferrer"
					className="underline"
				>
					Metatree AI Lab
				</a>
				. Metatree AI Chatbot
			</div>
		</div>
	);
};

export default ChatInput;
