import type { AppProps } from 'next/app';
import { Fragment } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';

import type { Page } from '@/types/page';

import '@/styles/globals.css';

type Props = AppProps & {
	Component: Page;
};

const App = ({ Component, pageProps }: Props) => {
	const getLayout = Component.getLayout ?? (page => page);
	const Layout = Component.layout ?? Fragment;

	const queryClient = new QueryClient();

	return (
		<div>
			<Toaster />
			<QueryClientProvider client={queryClient}>
				<Layout>{getLayout(<Component {...pageProps} />)}</Layout>
			</QueryClientProvider>
		</div>
	);
};

export default App;
