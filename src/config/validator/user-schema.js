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

const findUser = {
  id: {
    notEmpty: true,
    isMongoId: {
      errorMessage: 'Invalid id'
    }
  }
};

const updateUser = {
  id: {
    notEmpty: true,
    isMongoId: {
      errorMessage: 'Invalid id'
    }
  }
};

export { createUser, findUser, updateUser };
