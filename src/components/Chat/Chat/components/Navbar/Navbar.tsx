import { IconPlus } from '@tabler/icons-react';

import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { createConversation, selectConversationState } from '@/store/slices/conversationSlice';

const Navbar = () => {
	const dispatch = useAppDispatch();
	const { currentConversation } = useAppSelector(selectConversationState);

	const handleCreateItem = () => {
		dispatch(
			createConversation({
				title: '新对话'
			})
		);
	};

	return (
		<nav className="flex w-full justify-between bg-[#202123] px-4 py-3">
			<div className="mr-4" />

			<div className="max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap">
				{currentConversation?.title || 'New conversation'}
			</div>

			<IconPlus
				className="cursor-pointer hover:text-neutral-400"
				onClick={handleCreateItem}
			/>
		</nav>
	);
};

export default Navbar;
