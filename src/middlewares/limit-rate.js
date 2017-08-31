import ExpressBrute from 'express-brute';
import RedisStore from 'express-brute-redis';

let store = null;

if (process.env.NODE_ENV === 'production') {
  store = new RedisStore({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
    // client: pre-connected redis client
  });
} else {
  store = new ExpressBrute.MemoryStore();
}

const handleStoreError = (error) => {
  throw error;
};

// Start slowing requests after 5 failed attempts to do something for the same user
const singleBruteforce = new ExpressBrute(store, {
  freeRetries: 10,
  minWait: 5 * 60 * 1000, // 5 minutes
  maxWait: 60 * 60 * 1000, // 1 hour,
  failCallback: ExpressBrute.FailForbidden,
  handleStoreError
});
// No more than 1000 login attempts per day per IP
const globalBruteforce = new ExpressBrute(store, {
  freeRetries: 1000,
  attachResetToRequest: false,
  refreshTimeoutOnRequest: false,
  minWait: 25 * 60 * 60 * 1000, // 1 day 1 hour (should never reach this wait time)
  maxWait: 25 * 60 * 60 * 1000, // 1 day 1 hour (should never reach this wait time)
  lifetime: 24 * 60 * 60, // 1 day (seconds not milliseconds)
  failCallback: ExpressBrute.FailTooManyRequests,
  handleStoreError
});


export default {
  prevent: globalBruteforce.prevent,
  middleware: singleBruteforce.getMiddleware({
    key: (req, res, next) => {
      next(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
    }
  })
};
