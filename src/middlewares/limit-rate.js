import ExpressBrute from 'express-brute';
import RedisStore from 'express-brute-redis';
import redisClient from '../config/redis';

let store = null;

if (process.env.NODE_ENV === 'production') {
  const redis = redisClient.getInstance();
  store = new RedisStore({
    client: redis
  });
} else {
  store = new ExpressBrute.MemoryStore();
}

const handleStoreError = (error) => {
  throw error;
};

// Start slowing requests after 10 failed attempts to do something for the same user
const singleBruteforce = new ExpressBrute(store, {
  freeRetries: 10,
  minWait: 1 * 60 * 1000, // 1 minutes
  maxWait: 60 * 60 * 1000, // 1 hour,
  failCallback: ExpressBrute.FailForbidden,
  handleStoreError
});

// No more than 10 requests per minute per IP, after that wait an hour
const globalBruteforce = new ExpressBrute(store, {
  freeRetries: 10000,
  attachResetToRequest: false,
  refreshTimeoutOnRequest: false,
  minWait: 60 * 60 * 1000, // 1 hour
  maxWait: 60 * 60 * 1000, // 1 hour (should never reach this wait time)
  lifetime: 60, // 1 minute (seconds not milliseconds)
  failCallback: ExpressBrute.FailTooManyRequests,
  handleStoreError
});

export default {
  globalRateLimit: globalBruteforce.prevent,
  singleRateLimit: param => singleBruteforce.getMiddleware({
    key: (req, res, next) => {
      next(param);
    }
  })
};
