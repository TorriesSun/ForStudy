import { IconCheck, IconClipboard } from '@tabler/icons-react';
import { FC, memo, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface Props {
	language: string;
	value: string;
}

const CodeBlock: FC<Props> = memo(({ language, value }) => {
	const [isCopied, setIsCopied] = useState<boolean>(false);

	const copyToClipboard = () => {
		if (!navigator.clipboard || !navigator.clipboard.writeText) {
			return;
		}

		navigator.clipboard.writeText(value).then(() => {
			setIsCopied(true);

			setTimeout(() => {
				setIsCopied(false);
			}, 2000);
		});
	};
	// const downloadAsFile = () => {
	// 	const fileExtension = programmingLanguages[language] || '.file';
	// 	const suggestedFileName = `file-${generateRandomString(3, true)}${fileExtension}`;
	// 	const fileName = window.prompt(t('Enter file name') || '', suggestedFileName);

	// 	if (!fileName) {
	// 		// user pressed cancel on prompt
	// 		return;
	// 	}

	// 	const blob = new Blob([value], { type: 'text/plain' });
	// 	const url = URL.createObjectURL(blob);
	// 	const link = document.createElement('a');
	// 	link.download = fileName;
	// 	link.href = url;
	// 	link.style.display = 'none';
	// 	document.body.appendChild(link);
	// 	link.click();
	// 	document.body.removeChild(link);
	// 	URL.revokeObjectURL(url);
	// };
	return (
		<div className="relative p-0 font-sans text-[16px]">
			<div className="flex items-center justify-between px-4 py-1.5">
				<span className="text-xs lowercase text-white">{language}</span>

				<div className="flex items-center">
					<button
						type="button"
						className="flex items-center gap-1.5 rounded bg-none p-1 text-xs text-white"
						onClick={copyToClipboard}
					>
						{isCopied ? <IconCheck size={18} /> : <IconClipboard size={18} />}
						{isCopied ? 'Copied!' : 'Copy code'}
					</button>
					{/* <button
						type="button"
						className="flex items-center rounded bg-none p-1 text-xs text-white"
						onClick={downloadAsFile}
					>
						<IconDownload size={18} />
					</button> */}
				</div>
			</div>

			<SyntaxHighlighter language={language} style={oneDark} customStyle={{ margin: 0 }}>
				{value}
			</SyntaxHighlighter>
		</div>
	);
});
CodeBlock.displayName = 'CodeBlock';

export default CodeBlock;
