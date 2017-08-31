import User from '../models/user-model';

const list = (req, res, next) => {
  try {
    User.list({}).then((users) => {
      res.status(200).json({ status: 'ok', users });
    }).catch(next);
  } catch (err) {
    next(err);
  }
};

const create = (req, res, next) => {
  try {
    const user = new User({
      'emails.0.address': req.body.email,
      'emails.0.default': true,
      password: req.body.password,
      services: [
        { type: 'password', email: req.body.email }
      ],
      profile: {
        firstName: req.body.firstName || '',
        lastName: req.body.lastName || ''
      }
    });

    user.save().then(() => {
      res.status(200).json({ status: 'ok', message: 'User created' });
    }).catch(next);
  } catch (err) {
    next(err);
  }
};

export default { list, create };
