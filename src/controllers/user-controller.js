import User from '../models/user-model';

const list = (req, res) => {
  // const { limit = 50, skip = 0 } = req.query;
  User.list({})
    .then((users) => {
      res.status(200).json({ status: 'ok', users });
    })
    .catch(error => res.status(500).json({ status: 'error', error }));
};

const create = (req, res) => {
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

  user.save()
    .then(() => {
      res.status(200).json({ status: 'ok', message: 'User created' });
      return true;
    })
    .catch(error => res.status(400).json({ status: 'error', error: error.message }));
};

export default { list, create };
