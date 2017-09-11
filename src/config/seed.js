import User from '../models/user';
import Client from '../models/client';
import { debugApp } from './debug';
import logger from '../helpers/logger';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
  Client.count({}).exec().then((clientCnt) => {
    if (clientCnt === 0) {
      debugApp('No default client found');
      new Client({ name: 'default_client' }).save().then((_client) => {
        Client.encryptSecret(_client._id, (err) => {
          if (err) {
            logger.error(err);
          } else {
            debugApp('Default client info');
            debugApp(`client_id: ${_client.id}`);
            debugApp(`client_secret: ${_client.secret}`);
          }
        });
      }).catch(logger.error);
    }
  });

  User.count({}).exec().then((userCnt) => {
    if (userCnt === 0) {
      debugApp('No default user found');
      new User({
        email: 'admin@admin.com',
        password: 'admin',
        role: 'admin'
      }).save().then((_user) => {
        debugApp('Default user info');
        debugApp(`username: ${_user.email}`);
        debugApp('password: admin');
      }).catch(logger.error);
    }
  });
}
