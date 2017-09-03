import bcrypt from 'bcrypt';
import logger from '../helpers/logger';
import Client from '../models/client-model';

/**
 * Get client
 * @returns {Client}
 */
const getClient = (req, res, next) => {
  Client.findById(req.params.id).then((client) => {
    if (!client) {
      res.status(404).json({ status: 'ok', message: 'Client not found' });
    } else {
      res.status(200).json({ status: 'ok', client });
    }
  }).catch(next);
};

/**
 * Create new client
 * @property {string} req.body.id - The Id of client.
 * @property {string} req.body.secret - The Secret of client.
 * @property {string} req.body.name - The Name of client.
 * @returns {Client}
 */
const createClient = (req, res, next) => {
  const client = new Client({
    name: req.body.name
  });

  client.save().then((savedClient) => {
    res.status(201).json({ status: 'ok', client: savedClient });
    bcrypt.hash(savedClient.secret, 10).then((hash) => {
      Client.update({ _id: savedClient._id }, { $set: { secret: hash } })
        .exec()
        .then(() => {
          logger.info(`Client ${savedClient.id} saved`);
        })
        .catch((err) => {
          logger.error(err.message);
        });
      return next();
    }).catch((err) => {
      throw new Error('Error with secret hash', err);
    });
  }).catch(e => next(e));
};

/**
 * Get client list.
 * @property {number} req.query.skip - Number of clients to be skipped.
 * @property {number} req.query.limit - Limit number of clients to be returned.
 * @returns {Client[]}
 */
const listClients = (req, res, next) => {
  Client.list({}).then((clients) => {
    res.status(200).json({ status: 'ok', clients });
  }).catch(next);
};


export default { getClient, createClient, listClients };
