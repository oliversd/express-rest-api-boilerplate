const welcomeEmailTemplate = (id, token) => `${id} ${token}`;
const verifyEmailTemplate = (id, token) => `${id} ${token}`;
const verifiedEmailTemplate = () => `${new Date()}`;
const forgotPasswordTemplate = (id, token) => `${id} ${token}`;
const resetPasswordTemplate = (username, password) => `${username} ${password}`;

export {
  welcomeEmailTemplate,
  verifyEmailTemplate,
  forgotPasswordTemplate,
  resetPasswordTemplate,
  verifiedEmailTemplate
};
