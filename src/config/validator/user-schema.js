const createUser = {
  email: {
    optional: {
      options: { checkFalsy: true } // or: [{ checkFalsy: true }]
    },
    isEmail: {
      errorMessage: 'Invalid Email'
    }
  },
  password: {
    notEmpty: true,
    errorMessage: 'Pasword is required' // Error message for the parameter
  },
};

export default createUser;
