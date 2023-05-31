import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { AUTH } from '@/constants/storeLocation';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { initMe, selectUser } from '@/store/slices/userSlice';
import { delAll, get as storeGet, put as storePut } from '@/utils/storageHelper';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const dispatch = useAppDispatch();
	const router = useRouter();

	useEffect(() => {
		// auth check
		const auth: TAuth = storeGet(AUTH);
		if (!auth.exp || auth.exp < Math.round(new Date().getTime() / 1000)) {
			storePut(AUTH, null);
			delAll();
			router.push('/login');
			return;
		}
		dispatch(initMe());
	}, []);

	const user = useAppSelector(selectUser);
	if (!user) return null;

	return <div>{children}</div>;
};

export default AuthProvider;
