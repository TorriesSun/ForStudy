import DefaultLayout from '@/layouts/DefaultLayout/DefaultLayout';

type ComponentType = React.FC & { layout: typeof DefaultLayout };

const Homepage: ComponentType = () => {
	return (
		<div className="m-10 lg:mx-20">
			<h1 className="mb-6 text-2xl font-semibold">欢迎使用 Metatree AI 智能聊天机器人</h1>
		</div>
	);
};

Homepage.layout = DefaultLayout;

export default Homepage;
