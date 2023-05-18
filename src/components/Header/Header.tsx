import Link from 'next/link';
import React from 'react';

type HeaderBarProps = {
	children?: React.ReactNode;
};

export const HeaderBar: React.FC<HeaderBarProps> = ({ children }) => {
	return (
		<header>
			<div className="flex items-center justify-between">
				<Link href="/">
					<span className="text-2xl font-semibold">Metatree AI</span>
				</Link>
				{children}
			</div>
		</header>
	);
};

const Header = () => {
	const { user } = { user: null };

	return (
		<div className="m-6 md:mx-10">
			<HeaderBar>
				<nav>
					{!user && (
						<>
							<Link href="/login" className="mr-4 text-lg">
								登陆
							</Link>
							<Link href="/create-account" className="text-lg">
								创建账号
							</Link>
						</>
					)}
					{user && (
						<>
							<Link href="/account" className="mr-4 text-lg">
								我的账号
							</Link>
							<Link href="/logout" className="text-lg">
								退出
							</Link>
						</>
					)}
				</nav>
			</HeaderBar>
		</div>
	);
};

export default Header;
