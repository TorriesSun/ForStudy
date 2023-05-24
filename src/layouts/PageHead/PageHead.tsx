import Head from 'next/head';

interface PageHeadProps {
	meta?: IMeta | Partial<IMeta>;
	url?: string;
	thumbnailSrc?: string;
	title?: string;
}

const PageHead: React.FC<PageHeadProps> = props => {
	const { meta, url = '', thumbnailSrc = '', title } = props;
	const pageTitle = title ? `${title} | ` : '';

	const metaList = [
		{
			name: 'description',
			content: meta?.description ?? 'Metatree AI'
		},
		{
			name: 'keywords',
			content: meta?.keywords ?? 'metatree, ai'
		},
		{ name: 'referrer', content: 'always' },
		{
			name: 'robots',
			content: 'index, follow'
		},
		{
			property: 'og:url',
			content: url
		},
		{
			property: 'og:title',
			content: meta?.title ?? 'Metatree AI'
		},
		{
			property: 'og:site_name',
			content: meta?.title ?? 'Metatree AI'
		},
		{
			property: 'og:type',
			content: 'website'
		},
		{
			property: 'og:description',
			content: meta?.description || 'Metatree AI'
		},
		{
			property: 'twitter:title',
			content: meta?.title ?? 'Metatree AI'
		},
		{
			property: 'twitter:description',
			content: meta?.description ?? 'Metatree AI'
		},
		{ property: 'twitter:image:src', content: thumbnailSrc ?? 'Metatree AI' },
		{ property: 'og:image', content: thumbnailSrc ?? '' },
		{ property: 'og:image:secure_url', content: thumbnailSrc ?? '' }
	];

	return (
		<Head>
			<title>
				{meta?.title ? `${meta?.title} | Metatree AI` : `${pageTitle}Metatree AI`}
			</title>
			{metaList.map(m => (
				<meta
					name={m.name}
					property={m.property}
					content={m.content}
					key={m.name ?? m.property}
				/>
			))}
		</Head>
	);
};

export default PageHead;
