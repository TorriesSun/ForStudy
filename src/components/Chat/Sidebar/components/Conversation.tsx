import { IconCheck, IconMessage, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { KeyboardEvent, MouseEventHandler, useEffect, useState } from 'react';

import SidebarActionButton from '@/components/Buttons/SidebarActionButton';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import {
	deleteConversation,
	selectConversationState,
	updateConversation
} from '@/store/slices/conversationSlice';

interface Props {
	conversation: TConversationInList;
}

const ConversationComponent = ({ conversation }: Props) => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { currentConversation } = useAppSelector(selectConversationState);

	const [isDeleting, setIsDeleting] = useState(false);
	const [isRenaming, setIsRenaming] = useState(false);
	const [renameValue, setRenameValue] = useState('');

	const handleSelectConversation = (id: string) => {
		if (currentConversation?.id !== id) {
			router.push({
				query: {
					id
				}
			});
		}
	};

	const handleRename = () => {
		if (renameValue.trim().length > 0 && currentConversation) {
			dispatch(
				updateConversation({
					id: currentConversation.id,
					title: renameValue
				})
			);
			setRenameValue('');
			setIsRenaming(false);
		}
	};

	const handleEnterDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleRename();
		}
	};

	const handleConfirm: MouseEventHandler<HTMLButtonElement> = e => {
		e.stopPropagation();
		if (isDeleting) {
			dispatch(deleteConversation(conversation.id));
		} else if (isRenaming) {
			handleRename();
		}
		setIsDeleting(false);
		setIsRenaming(false);
	};

	const handleCancel: MouseEventHandler<HTMLButtonElement> = e => {
		e.stopPropagation();
		setIsDeleting(false);
		setIsRenaming(false);
	};

	const handleOpenRenameModal: MouseEventHandler<HTMLButtonElement> = e => {
		e.stopPropagation();
		setIsRenaming(true);
		if (currentConversation) setRenameValue(currentConversation.title);
	};

	const handleOpenDeleteModal: MouseEventHandler<HTMLButtonElement> = e => {
		e.stopPropagation();
		setIsDeleting(true);
	};

	useEffect(() => {
		if (isRenaming) {
			setIsDeleting(false);
		} else if (isDeleting) {
			setIsRenaming(false);
		}
	}, [isRenaming, isDeleting]);

	return (
		<div className="relative flex items-center">
			{isRenaming && currentConversation?.id === conversation.id ? (
				<div className="flex w-full items-center gap-3 rounded-lg bg-[#343541]/90 p-3">
					<IconMessage size={18} />
					<input
						className="mr-12 flex-1 overflow-hidden text-ellipsis border-neutral-400 bg-transparent text-left text-[12.5px] leading-3 text-white outline-none focus:border-neutral-100"
						type="text"
						value={renameValue}
						onChange={e => setRenameValue(e.target.value)}
						onKeyDown={handleEnterDown}
						// eslint-disable-next-line jsx-a11y/no-autofocus
						autoFocus
					/>
				</div>
			) : (
				<button
					type="button"
					className={`flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#343541]/90 ${
						currentConversation?.id === conversation.id ? 'bg-[#343541]/90' : ''
					}`}
					onClick={() => handleSelectConversation(conversation.id)}
				>
					<IconMessage size={18} color="white" />
					<div
						className={`relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-[12.5px] leading-3 text-white ${
							currentConversation?.id === conversation.id ? 'pr-12' : 'pr-1'
						}`}
					>
						{conversation.title}
					</div>
				</button>
			)}

			{(isDeleting || isRenaming) && currentConversation?.id === conversation.id && (
				<div className="absolute right-1 z-10 flex text-gray-300">
					<SidebarActionButton handleClick={handleConfirm}>
						<IconCheck size={18} />
					</SidebarActionButton>
					<SidebarActionButton handleClick={handleCancel}>
						<IconX size={18} />
					</SidebarActionButton>
				</div>
			)}

			{currentConversation?.id === conversation.id && !isDeleting && !isRenaming && (
				<div className="absolute right-1 z-10 flex text-gray-300">
					<SidebarActionButton handleClick={handleOpenRenameModal}>
						<IconPencil size={18} />
					</SidebarActionButton>
					<SidebarActionButton handleClick={handleOpenDeleteModal}>
						<IconTrash size={18} />
					</SidebarActionButton>
				</div>
			)}
		</div>
	);
};

export default ConversationComponent;
