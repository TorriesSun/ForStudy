/**
 * @description
 * Check whether it is client side render, to make sure window is defined
 * @return {boolean}
 */

export const checkCSR = (): boolean => typeof window !== 'undefined';

/**
 * @description
 * Check whether the rich text editor context is empty
 * @return {boolean}
 */

export const checkRichTextEmpty = (context = ''): boolean =>
	context.replace(/<(.|\n)*?>/g, '').trim().length === 0;
