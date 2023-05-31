import { IconArrowBarLeft, IconArrowBarRight } from '@tabler/icons-react';

interface Props {
	onClick: () => void;
	side: 'left' | 'right';
}

/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
export const CloseSidebarButton = ({ onClick, side }: Props) => {
	return (
		<>
			<button
				type="button"
				className={`fixed ${
					side === 'right' ? 'right-[270px]' : 'left-[270px]'
				} top-2 z-50 h-7 w-7 hover:text-gray-400 dark:text-white dark:hover:text-gray-300 ${
					side === 'right' ? 'sm:right-[270px]' : 'sm:left-[270px]'
				} sm:h-8 sm:w-8 sm:text-neutral-700`}
				onClick={onClick}
			>
				{side === 'right' ? <IconArrowBarRight /> : <IconArrowBarLeft />}
			</button>
			<div
				onClick={onClick}
				className="absolute left-0 top-0 z-10 h-full w-full bg-black opacity-70 sm:hidden"
			/>
		</>
	);
};

export default CloseSidebarButton;
