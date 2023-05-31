import { IconArrowBarLeft, IconArrowBarRight } from '@tabler/icons-react';

interface Props {
	onClick: () => void;
	side: 'left' | 'right';
}

export const OpenSidebarButton = ({ onClick, side }: Props) => {
	return (
		<button
			type="button"
			className={`fixed ${
				side === 'right' ? 'right-2' : 'left-2'
			} top-2 z-50 h-7 w-7 hover:text-gray-400 ${
				side === 'right' ? 'sm:right-2' : 'sm:left-2'
			} sm:h-8 sm:w-8 sm:text-neutral-700`}
			onClick={onClick}
		>
			{side === 'right' ? <IconArrowBarLeft /> : <IconArrowBarRight />}
		</button>
	);
};

export default OpenSidebarButton;
