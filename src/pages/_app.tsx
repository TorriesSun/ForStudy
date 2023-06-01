import type { AppProps } from 'next/app';
import { Fragment } from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';

import store from '@/store/store';
import type { Page } from '@/types/page';

import '@/styles/globals.css';

type Props = AppProps & {
	Component: Page;
};

const App = ({ Component, pageProps }: Props) => {
	const getLayout = Component.getLayout ?? (page => page);
	const Layout = Component.layout ?? Fragment;

	return (
		<Provider store={store}>
			<Toaster />
			<Layout>{getLayout(<Component {...pageProps} />)}</Layout>
		</Provider>
	);
};

export default App;
