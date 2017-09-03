import User from '../models/user-model';

const getUser = (req, res, next) => {
  User.findById(req.params.id).then((user) => {
    if (!user) {
      res.status(404).json({ status: 'ok', message: 'User not found' });
    } else {
      res.status(200).json({ status: 'ok', user });
    }
  }).catch(next);
};

const listUsers = (req, res, next) => {
  User.list({}).then((users) => {
    res.status(200).json({ status: 'ok', users });
  }).catch(next);
};

const createUser = (req, res, next) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    profile: {
      firstName: req.body.firstName || null,
      lastName: req.body.lastName || null
    }
  });

  user.save().then(() => {
    res.status(201).json({ status: 'ok', message: 'User created' });
    return true;
  }).catch(next);
};

const updateUser = (req, res, next) => {
  // The password can't be updated by this method for security reasons
  // the user must always ask for a reset email
  if (req.body.password) {
    res.status(400).json({ status: 'error', error: { message: 'You can´t change the password with this endpoint' } });
    return;
  } else if (req.body.email) {
    res.status(400).json({ status: 'error', error: { message: 'You can´t change the email with this endpoint' } });
    return;
  } else if (!req.body.firstName && !req.body.lastName) {
    res.status(400).json({ status: 'error', error: { message: 'Wrong request, profile data required' } });
    return;
  }
  // Check if the user exist
  User.findById(req.params.id).then((user) => {
    if (!user) {
      res.status(404).json({ status: 'error', error: { message: 'User not found' } });
    } else {
      const updatedUser = {
        'profile.firstName': req.body.firstName || user.profile.firstName,
        'profile.lastName': req.body.lastName || user.profile.lastName,
        'profile.avatar': req.body.avatar || user.profile.avatar
      };
      User.update({ _id: req.params.id }, { $set: updatedUser })
        .exec()
        .then(() => {
          res.status(200).json({ status: 'ok', message: 'User updated' });
        })
        .catch(next);
    }
  }).catch(next);
};

export default { listUsers, createUser, getUser, updateUser };
