import React from 'react';

type Props = {
	label: string;
};

const FormLabel: React.FC<Props> = ({ label }) => {
	return (
		<label
			className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right"
			htmlFor="name"
		>
			{label}
		</label>
	);
};

export default FormLabel;
