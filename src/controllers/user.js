import User from '../models/user';
import mailQueue from '../helpers/mail-queue';
import {
  welcomeEmailTemplate,
  verifyEmailTemplate,
  verifiedEmailTemplate,
  forgotPasswordTemplate,
  resetPasswordTemplate
} from '../helpers/mail-template';
import logger from '../helpers/logger';

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
    if (process.env.NODE_ENV === 'production') {
      mailQueue.enqueueJob('welcome', {
        from: process.env.MAIL_FROM,
        to: user.email,
        subject: 'Wellcome to appName, please verify your email',
        html: welcomeEmailTemplate(user._id, user.verify.token)
      }, (err) => {
        if (err) {
          logger.error(err);
        }
      });
    }
    res.status(201).json({ status: 'ok', message: 'User created' });
    return true;
  }).catch(next);
};

const updateUser = (req, res, next) => {
  // The password can't be updated by this method for security reasons
  // the user must always ask for a reset email
  if (req.body.password) {
    res.status(400).json({ status: 'error', message: 'You can´t change the password with this endpoint' });
    return;
  } else if (req.body.email) {
    res.status(400).json({ status: 'error', message: 'You can´t change the email with this endpoint' });
    return;
  } else if (!req.body.firstName && !req.body.lastName && !req.body.avatar) {
    res.status(400).json({ status: 'error', message: 'Wrong request, profile data required' });
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
          res.status(205).json({ status: 'ok', message: 'User updated' });
        })
        .catch(next);
    }
  }).catch(next);
};

const forgotPassword = (req, res, next) => {
  User.findOne({ email: req.body.email }).exec().then((user) => {
    if (user) {
      user.forgotPassword((err, token) => { // eslint-disable-line no-unused-vars
        if (err) {
          next(err);
        } else {
          // TODO: send email
          if (process.env.NODE_ENV === 'production') {
            mailQueue.enqueueJob('forgot', {
              from: process.env.MAIL_FROM,
              to: user.email,
              subject: 'You forgot your password',
              html: forgotPasswordTemplate(user._id, token)
            }, (_err) => {
              if (_err) {
                logger.error(_err);
              }
            });
          }
          res.status(200).json({
            status: 'ok',
            message: process.env.NODE_ENV === 'test' ?
              `${token} - Reset link sent to email` :
              'Reset link sent to email'
          });
        }
      });
    } else {
      res.status(404).json({ status: 'error', message: 'User not found' });
    }
  });
};

const resetPassword = (req, res, next) => {
  User.findOne({ _id: req.params.id }).exec().then((user) => {
    if (user) {
      user.resetPassword(req.query.token, (err, passwd) => { // eslint-disable-line no-unused-vars
        if (err) {
          next(err);
        } else {
          // TODO: send email
          if (process.env.NODE_ENV === 'production') {
            mailQueue.enqueueJob('reset', {
              from: process.env.MAIL_FROM,
              to: user.email,
              subject: 'Your password has been reset',
              html: resetPasswordTemplate(user.email, passwd)
            }, (_err) => {
              if (err) {
                logger.error(_err);
              }
            });
          }
          res.status(200).json({ status: 'ok', message: 'Password changed' });
        }
      });
    } else {
      res.status(404).json({ status: 'error', message: 'User not found' });
    }
  });
};

const changePassword = (req, res, next) => {
  User.findOne({ _id: req.params.id }).exec().then((user) => {
    if (user) {
      user.changePassword(req.body.old_password, (err, changed) => {
        if (err) {
          next(err);
        } else if (changed) {
          res.status(200).json({ status: 'ok', message: 'Password changed' });
        } else {
          res.status(400).json({ status: 'ok', message: 'Incorrect password' });
        }
      });
    } else {
      res.status(404).json({ status: 'error', message: 'User not found' });
    }
  });
};

const verifyEmail = (req, res, next) => {
  User.findOne({ _id: req.params.id }).exec().then((user) => {
    if (user) {
      user.verifyEmail(req.query.token, (err, verified) => { // eslint-disable-line no-unused-vars
        if (err) {
          next(err);
        } else {
          // TODO: send email
          if (process.env.NODE_ENV === 'production' && verified) {
            mailQueue.enqueueJob('verified', {
              from: process.env.MAIL_FROM,
              to: user.email,
              subject: 'Your password has been reset',
              html: verifiedEmailTemplate()
            }, (_err) => {
              if (err) {
                logger.error(_err);
              }
            });
          }
          res.status(200).json({ status: 'ok', message: verified ? 'Email verified' : 'Email not verified' });
        }
      });
    } else {
      res.status(404).json({ status: 'error', message: 'User not found' });
    }
  });
};

const askVerification = (req, res, next) => {
  User.findOne({ _id: req.params.id }).exec().then((user) => {
    if (user) {
      user.askVerification((err, token) => { // eslint-disable-line no-unused-vars
        if (err) {
          next(err);
        } else {
          // TODO: send email
          if (process.env.NODE_ENV === 'production') {
            mailQueue.enqueueJob('verify', {
              from: process.env.MAIL_FROM,
              to: user.email,
              subject: 'Your password has been reset',
              html: verifyEmailTemplate(user.id, token)
            }, (_err) => {
              if (err) {
                logger.error(_err);
              }
            });
          }
          res.status(200).json({
            status: 'ok',
            message: process.env.NODE_ENV === 'test' ?
              `${token} - Verification email sent` :
              'Verification email sent'
          });
        }
      });
    } else {
      res.status(404).json({ status: 'error', message: 'User not found' });
    }
  });
};

export default {
  listUsers,
  createUser,
  getUser,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  askVerification
};
