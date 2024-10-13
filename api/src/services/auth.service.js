const httpStatus = require('http-status');
const { OAuth2Client } = require('google-auth-library');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { USER_STATUS } = require('../utils/Constants');
const CLIENT_ID = '199759029626-dgc3280klfq5u5r0o44kho7fnomvgspk.apps.googleusercontent.com'


/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  if(user && user.status !== USER_STATUS.ACTIVE){
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please ask admin to activate your account');
  }
  return user;
};

const loginUserWithGoogleAuth = async (data) => {
  let token = data.credential
  const client = new OAuth2Client(CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  // {
  //   iss: 'https://accounts.google.com',
  //   azp: '199759029626-dgc3280klfq5u5r0o44kho7fnomvgspk.apps.googleusercontent.com',
  //   aud: '199759029626-dgc3280klfq5u5r0o44kho7fnomvgspk.apps.googleusercontent.com',
  //   sub: '118340681702953417606',
  //   email: 'adhavpavan@gmail.com',
  //   email_verified: true,
  //   nbf: 1714530294,
  //   name: 'Pavan Adhav',
  //   picture: 'https://lh3.googleusercontent.com/a/ACg8ocK16QmX4KwMErb4nRwG_-RuTfS5txuNZB0ouW7vFEIXWet4iVrc=s96-c',
  //   given_name: 'Pavan',
  //   family_name: 'Adhav',
  //   iat: 1714530594,
  //   exp: 1714534194,
  //   jti: 'f9dbc245f4b57e90a80dfd890188873487c14720'
  // }
  console.log("--------payload--------------", payload)
  if(payload?.email_verified){
    const user = await userService.getUserByEmail(payload?.email);
    if(!user){

      let u = {
        name: payload.name,
        email: payload.email,
        lastLogin: new Date(),
      }
      await userService.createUser(u)
    }

  return userService.getUserByEmail(payload?.email);
  // if (!user || !(await user.isPasswordMatch(password))) {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  // }
  // if(user && user.status !== USER_STATUS.ACTIVE){
  //   throw new ApiError(httpStatus.UNAUTHORIZED, 'Please ask admin to activate your account');
  }
  // return user;
};



/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  loginUserWithGoogleAuth
};
