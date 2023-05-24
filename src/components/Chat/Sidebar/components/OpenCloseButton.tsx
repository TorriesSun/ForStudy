import { IconArrowBarLeft, IconArrowBarRight } from '@tabler/icons-react';

interface Props {
	onClick: () => void;
	side: 'left' | 'right';
}

export const CloseSidebarButton = ({ onClick, side }: Props) => {
	return (
		<button
			type="button"
			className={`fixed top-5 ${
				side === 'right' ? 'right-[270px]' : 'left-[270px]'
			} z-50 h-7 w-7 hover:text-gray-400 sm:top-0.5 ${
				side === 'right' ? 'sm:right-[270px]' : 'sm:left-[270px]'
			} sm:h-8 sm:w-8 sm:text-neutral-700`}
			onClick={onClick}
		>
			{side === 'right' ? <IconArrowBarRight /> : <IconArrowBarLeft />}
		</button>
	);
};

export const OpenSidebarButton = ({ onClick, side }: Props) => {
	return (
		<button
			type="button"
			className={`fixed top-2.5 ${
				side === 'right' ? 'right-2' : 'left-2'
			} z-50 h-7 w-7 hover:text-gray-400 sm:top-0.5 ${
				side === 'right' ? 'sm:right-2' : 'sm:left-2'
			} sm:h-8 sm:w-8 sm:text-neutral-700`}
			onClick={onClick}
		>
			{side === 'right' ? <IconArrowBarLeft /> : <IconArrowBarRight />}
		</button>
	);
};
