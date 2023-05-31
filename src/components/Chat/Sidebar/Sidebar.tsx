import { IconMistOff, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import ChatBarSettings from './components/ChatBarSettings/ChatBarSetting';
import CloseSidebarButton from './components/CloseSidebarButton/CloseSidebarButton';
import ConversationComponent from './components/Conversation';
import OpenSidebarButton from './components/OpenSidebarButton/OpenSidebarButton';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import {
	createConversation,
	fetchMyConversationByIdAsync,
	fetchMyConversationsAsync,
	selectConversationState
} from '@/store/slices/conversationSlice';

interface Props {
	isOpen: boolean;
	side: 'left' | 'right';
	toggleOpen: () => void;
}

const Sidebar = ({ isOpen, side, toggleOpen }: Props) => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { conversations } = useAppSelector(selectConversationState);

	useEffect(() => {
		// Get conversations
		dispatch(fetchMyConversationsAsync());
	}, []);

	useEffect(() => {
		// Get conversation by id
		if (router.isReady && router.query.id) {
			dispatch(fetchMyConversationByIdAsync(router.query.id as string));
		}
	}, [router.query.id]);

	const handleCreateItem = () => {
		dispatch(
			createConversation({
				title: 'New Chat'
			})
		);
	};

	return isOpen ? (
		<div>
			<div className="fixed left-0 top-0 z-40 flex h-full w-[260px] flex-none flex-col space-y-2 bg-[#202123] p-2 text-[14px] transition-all sm:relative sm:top-0">
				<div className="flex items-center">
					<button
						type="button"
						className="flex w-full shrink-0 cursor-pointer select-none items-center gap-3 rounded-md border border-white/20 p-3 text-white transition-colors duration-200 hover:bg-gray-500/10"
						onClick={() => {
							handleCreateItem();
						}}
					>
						<IconPlus size={16} />
						创建新对话
					</button>
				</div>
				<div className="grow overflow-auto">
					{conversations?.length > 0 ? (
						<div className="pt-2">
							{conversations.map(conversation => (
								<ConversationComponent
									key={conversation.id}
									conversation={conversation}
								/>
							))}
						</div>
					) : (
						<div className="mt-8 select-none text-center text-white opacity-50">
							<IconMistOff className="mx-auto mb-3" />
							<span className="text-[14px] leading-normal">No data.</span>
						</div>
					)}
				</div>
				<ChatBarSettings />
			</div>

			<CloseSidebarButton onClick={toggleOpen} side={side} />
		</div>
	) : (
		<OpenSidebarButton onClick={toggleOpen} side={side} />
	);
};

export default Sidebar;
