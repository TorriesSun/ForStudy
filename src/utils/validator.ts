/* eslint no-useless-escape:0 */
const emailReg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;

/**
 * @description
 * Check whether an email address is valid
 * @param {string} email an email address
 * @return {boolean} return a boolean
 */

const isEmail = (email: string): boolean => emailReg.test(email);

/**
 * @description
 * Check whether it is a mobile
 * @return {boolean} return a boolean
 */

export const isMobile = () => {
	const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
	const mobileRegex =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
	return mobileRegex.test(userAgent);
};

export default isEmail;
