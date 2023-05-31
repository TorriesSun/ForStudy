import { pick } from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Input from '@/components/FormComponents/FormInput/FormInput';
import FormLabel from '@/components/FormComponents/FormLabel/FormLabel';
import { AUTH } from '@/constants/storeLocation';
import DefaultLayout from '@/layouts/DefaultLayout/DefaultLayout';
import PageHead from '@/layouts/PageHead/PageHead';
import { login } from '@/services/auth.service';
import { put as storePut } from '@/utils/storageHelper';
import isEmail from '@/utils/validator';

type FormData = {
	email: string;
	password: string;
};

type ComponentType = React.FC & { layout: typeof DefaultLayout };

const LoginPage: ComponentType = () => {
	const [error, setError] = useState('');
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FormData>();

	const onSubmit = useCallback(
		async (data: FormData) => {
			try {
				setError('');
				const res = await login(data);
				if (res.status === 401) {
					throw new Error('登陆验证失败，请核对您输入的邮箱和密码');
				} else if (res.status === 200) {
					if (res.data) {
						storePut(AUTH, pick(res.data, ['token', 'exp']));
					}
					toast.success('登陆成功。');
					router.push('/chat');
				}
			} catch (err) {
				if (err instanceof Error) {
					setError(err?.message || '登陆失败');
				}
			}
		},
		[router]
	);

	return (
		<>
			<PageHead title="Login" />
			<div>
				<div className="mx-4 mt-36 rounded-lg bg-white px-6 py-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:px-10">
					<h1 className="mb-6 text-2xl">登陆</h1>
					<form className="mx-auto w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
						<div className="md:flex md:items-center">
							<div className="md:w-1/4">
								<FormLabel label="邮箱" />
							</div>
							<div className="md:w-2/3">
								<Input
									name="email"
									register={register}
									registerOptions={{
										required: '请输入您的邮箱地址',
										validate: {
											always: value =>
												isEmail(value) || '请输入有效的邮箱地址'
										}
									}}
								/>
							</div>
						</div>
						{errors.email && (
							<div className="mt-2 text-sm text-red-400 md:ml-24 md:w-2/3">
								* {errors.email.message}
							</div>
						)}
						<div className="mt-6 md:flex md:items-center">
							<div className="md:w-1/4">
								<FormLabel label="密码" />
							</div>
							<div className="md:w-2/3">
								<Input
									name="password"
									register={register}
									type="password"
									registerOptions={{ required: '请输入您的密码' }}
								/>
							</div>
						</div>
						{errors.password && (
							<div className="mt-2 text-sm text-red-400 md:ml-24 md:w-2/3">
								* {errors.password.message}
							</div>
						)}
						<div className="mt-6 md:flex md:items-center">
							<div className="w-full text-center">
								{error && (
									<div className="mb-2 text-center text-sm text-red-400">
										{error}
									</div>
								)}
								<button
									className="rounded bg-blue-500 px-6 py-2 font-bold text-white shadow hover:bg-blue-400 focus:outline-none"
									type="submit"
								>
									登陆
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

LoginPage.layout = DefaultLayout;

export default LoginPage;
