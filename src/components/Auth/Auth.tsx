import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { initMe, selectUser } from '@/store/slices/userSlice';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(initMe());
	}, []);

	const user = useAppSelector(selectUser);
	if (!user) return null;

	return <div>{children}</div>;
};

export default AuthProvider;
