import nodemailer from 'nodemailer';

class Mailer {
  /** setup email data with unicode symbols
   * {
   *   host: 'smtp.ethereal.email',
   *   port: 587,
   *   secure: false, // true for 465, false for other ports
   *   auth: {
   *     user: account.user, // generated ethereal user
   *     pass: account.pass  // generated ethereal password
   *   }
   * }
   */
  constructor(options) {
    // create reusable transporter object using the default SMTP transport
    this.transporter = nodemailer.createTransport(options);
  }

  /** setup email data with unicode symbols
   * {
   *   from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
   *   to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
   *   subject: 'Hello ✔', // Subject line
   *   text: 'Hello world?', // plain text body
   *   html: '<b>Hello world?</b>' // html body
   * };
   */
  sendMail(options) {
    return new Promise((resolve, reject) => {
      // send mail with defined transport object
      this.transporter.sendMail(options, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  }
}

export default Mailer;
