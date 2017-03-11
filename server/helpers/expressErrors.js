// Wrap funciton for async/await
// thanks to https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators
// and https://medium.freecodecamp.com/getting-started-with-async-await-b66385983875#.mq1zbgke6
// catch any errors in the promise and either forward them to next(err) or ignore them
export const catchErrors = fn => (req, res, next) => fn(req, res, next).catch(next);
export const ignoreErrors = fn => (req, res, next) => fn(req, res, next).catch(() => next());
