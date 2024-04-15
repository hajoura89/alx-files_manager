#!/usr/bin/node
import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * Definition of a Redis client.
 */
class RedisClient {
  /**
   * Instantiates a new RedisClient object.
   */
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Failed to establish connection with Redis client:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
   * Checks whether the client is connected to the Redis server.
   * @returns {boolean}
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * Retrieves the value associated with the specified key.
   * @param {String} key - The key of the item to retrieve.
   * @returns {String | Object}
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Stores a key-value pair along with an expiration time.
   * @param {String} key - The key of the item to store.
   * @param {String | Number | Boolean} value - The item to store.
   * @param {Number} duration - The expiration time of the item in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  /**
   * Removes the value associated with the specified key.
   * @param {String} key - The key of the item to remove.
   * @returns {Promise<void>}
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
