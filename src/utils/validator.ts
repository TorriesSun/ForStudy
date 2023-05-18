/* eslint no-useless-escape:0 */
const emailReg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;

/**
 * @description
 * Check whether an email address is valid
 * @param {string} email an email address
 * @return {boolean} return a boolean
 */

const isEmail = (email: string): boolean => emailReg.test(email);

export default isEmail;
