import User from '../models/user-model';

const list = (req, res) => {
  // const { limit = 50, skip = 0 } = req.query;
  User.list({})
    .then(users => res.json(users))
    .catch(error => error);
};

const create = (req, res) => {
  return 'test';
};

export default { list, create };
