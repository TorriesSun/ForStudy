import type { NextPage } from 'next';
import type { ComponentType, ReactElement, ReactNode } from 'react';

export type Page = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
	layout?: ComponentType;
};
