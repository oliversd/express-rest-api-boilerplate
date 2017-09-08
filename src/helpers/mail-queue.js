import Queue from './queue';
import Mailer from './mailer';

const mailer = new Mailer({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USERNAME, // generated ethereal user
    pass: process.env.MAIL_PASSWORD  // generated ethereal password
  }
});

const sendEmail = (params, callback) => {
  mailer.sendMail(params).then(info => callback(null, info)).catch(callback);
};

const queue = new Queue(process.env.MONGO_URI, 'mail', {
  forgot: sendEmail,
  reset: sendEmail,
  verify: sendEmail,
  verified: sendEmail,
  welcome: sendEmail
});

/**
 * queue.enqueueJob('forgot', {
 *   from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
 *   to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
 *   subject: 'Hello ✔', // Subject line
 *   text: 'Hello world?', // plain text body
 *   html: '<b>Hello world?</b>' // html body
 * }, (err, info) => {
 *   if (err) {
 *     console.log(err);
 *   } else {
 *     console.log(info);
 *   }
 * });
 */
export default queue;
