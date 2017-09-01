import redis from 'redis';
import { debugRedis } from '../config/debug';

class RedisClient {
  constructor() {
    this.instance = null;
  }

  createInstance() {
    const redisClient = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    });

    /**
     * client will emit ready once a connection is established. Commands issued
     * before the ready event are queued, then replayed just before this event
     * is emitted.
     */
    redisClient.on('ready', () => {
      debugRedis('Connection is established');
    });

    /**
     * client will emit connect as soon as the stream is connected to the server.
     */
    redisClient.on('connect', () => {
      debugRedis('Stream is connected to the server');
    });

    /**
     * client will emit reconnecting when trying to reconnect to the Redis server after
     * losing the connection. Listeners are passed an object containing delay (in ms)
     * and attempt (the attempt #) attributes.
     */
    redisClient.on('reconnecting', () => {
      debugRedis('Connecting to server after losing the connection');
    });

    /**
     * client will emit error when encountering an error connecting to the Redis server or
     * when any other in node_redis occurs. If you use a command without callback and
     * encounter a ReplyError it is going to be emitted to the error listener.
     * So please attach the error listener to node_redis.
     */
    redisClient.on('error', (err) => {
      debugRedis(err.message);
    });

    /**
     * client will emit end when an established Redis server connection has closed.
     */
    redisClient.on('end', () => {
      debugRedis('connection has closed');
    });

    /**
     * client will emit warning when password was set but none is needed and if a deprecated
     * option / function / similar is used.
     */
    redisClient.on('warning', (warn) => {
      debugRedis(warn);
    });
    this.instance = redisClient;
    return this.instance;
  }

  getInstance() {
    if (!this.instance) {
      return this.createInstance();
    }
    return this.instance;
  }
}

const redisClient = new RedisClient();

export default redisClient.getInstance();
