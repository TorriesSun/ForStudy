import React from 'react';
import { FieldValues, RegisterOptions, UseFormRegister } from 'react-hook-form';

type Props = {
	name: string;
	register: UseFormRegister<FieldValues & any>; // eslint-disable-line @typescript-eslint/no-explicit-any
	registerOptions: RegisterOptions;
	type?: 'text' | 'number' | 'password';
	className?: string;
};

const FormInput: React.FC<Props> = ({
	name,
	register,
	registerOptions = {},
	type = 'text',
	className
}) => {
	return (
		<input
			className={`w-full appearance-none rounded border-2 border-blue-50 bg-blue-50 px-4 py-2 leading-tight text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none ${className}`}
			{...{ type }}
			{...register(name, registerOptions)}
		/>
	);
};

export default FormInput;
