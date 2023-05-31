import { IconLogout } from '@tabler/icons-react';
import { useRouter } from 'next/router';

import SidebarButton from '../SidebarButton/SidebarButton';

import { useAppDispatch } from '@/hooks/useRedux';
import { handleLogout } from '@/store/slices/userSlice';

export const ChatBarSettings = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const logout = async () => {
		dispatch(handleLogout());
		router.push('/');
	};
	return (
		<div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">
			<SidebarButton text="Logout" icon={<IconLogout size={18} />} onClick={logout} />
		</div>
	);
};

export default ChatBarSettings;
