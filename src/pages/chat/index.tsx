import { useRef, useState } from 'react';

import AuthProvider from '@/components/Auth';
import Chat from '@/components/Chat/Chat/Chat';
import Navbar from '@/components/Chat/Chat/components/Navbar/Navbar';
import Sidebar from '@/components/Chat/Sidebar/Sidebar';
import PageHead from '@/layouts/PageHead/PageHead';

const ChatPage = () => {
	const [showChatBar, setShowChatBar] = useState(true);

	const stopConversationRef = useRef<boolean>(false);

	return (
		<AuthProvider>
			<PageHead title="Chat" />
			<main className="flex h-screen w-screen flex-col text-sm text-white">
				<div className="fixed top-0 w-full sm:hidden">
					<Navbar />
				</div>
				<div className="flex h-full w-full pt-[48px] sm:pt-0">
					<Sidebar
						isOpen={showChatBar}
						side="left"
						toggleOpen={() => setShowChatBar(!showChatBar)}
					/>
					<div className="flex flex-1">
						<Chat stopConversationRef={stopConversationRef} />
					</div>
				</div>
			</main>
		</AuthProvider>
	);
};

export default ChatPage;
