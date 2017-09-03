import Client from '../models/client-model';

/**
 * Load client and append to req.
 */
function load(req, res, next, id) {
  Client.findById(id)
    .then((client) => {
      req.client = client; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get client
 * @returns {Client}
 */
function get(req, res) {
  if (!req.client) {
    res.status(404).json({ status: 'ok', message: 'Client not found' });
  } else {
    res.status(200).json({ status: 'ok', client: req.client });
  }
}

/**
 * Create new client
 * @property {string} req.body.id - The Id of client.
 * @property {string} req.body.secret - The Secret of client.
 * @property {string} req.body.name - The Name of client.
 * @returns {Client}
 */
function create(req, res, next) {
  const client = new Client({
    name: req.body.name
  });

  client.save().then((savedClient) => {
    res.status(201).json({ status: 'ok', client: { id: savedClient.id, secret: savedClient.secret } });
  }).catch(e => next(e));
}

/**
 * Get client list.
 * @property {number} req.query.skip - Number of clients to be skipped.
 * @property {number} req.query.limit - Limit number of clients to be returned.
 * @returns {Client[]}
 */
function list(req, res, next) {
  const query = {};
  if (req.query.name) {
    query.name = req.query.name;
  }
  Client.list(query, parseInt(req.query.skip || 0, 10), parseInt(req.query.limit || 50, 10))
    .then(users => res.json(users))
    .catch(e => next(e));
}


export default { load, get, create, list };
