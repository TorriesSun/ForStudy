import { useState } from 'react';

import AuthProvider from '@/components/Auth';
import Sidebar from '@/components/Chat/Sidebar/Sidebar';
import PageHead from '@/layouts/PageHead/PageHead';

const ChatPage = () => {
	const [showChatBar, setShowChatBar] = useState(true);

	return (
		<AuthProvider>
			<PageHead title="Chat" />
			<main className="flex h-screen w-screen flex-col text-sm">
				<div className="flex h-full w-full pt-[48px] sm:pt-0">
					<Sidebar
						isOpen={showChatBar}
						side="left"
						toggleOpen={() => setShowChatBar(!showChatBar)}
					/>
				</div>
			</main>
		</AuthProvider>
	);
};

export default ChatPage;
