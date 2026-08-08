const config = require("../config/config.json");
const { createClient } = require("redis");

function getCacheKey(key, group) {
  return `${group}:${key}`;
}

async function set(data, group = "default") {
  const client = await createClient({
    url: `redis://${config.redis.dev.username}:${encodeURIComponent(
      config.redis.dev.password
    )}@${config.redis.dev.host}:${config.redis.dev.port}/0`,
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
  const values = {};

  for (const [key, value] of Object.entries(data)) {
    const cacheKey = getCacheKey(key, group);
    const result = await client.get(cacheKey);
    if (result !== null) {
      values[key] = false;
    } else {
      await client.set(cacheKey, JSON.stringify(value));
      await client.expire(cacheKey, 7 * 24 * 60 * 60);
      values[key] = true;
    }
  }
  client.quit();

  return values;
}

async function replace(data, group = "default") {
  const client = await createClient({
    url: `redis://${config.redis.dev.username}:${encodeURIComponent(
      config.redis.dev.password
    )}@${config.redis.dev.host}:${config.redis.dev.port}/0`,
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
  const values = {};

  for (const [key, value] of Object.entries(data)) {
    const cacheKey = getCacheKey(key, group);
    const result = await client.get(cacheKey);
    if (result !== null) {
      await client.set(cacheKey, JSON.stringify(value));
      await client.expire(cacheKey, 7 * 24 * 60 * 60);
      values[key] = true;
    } else {
      values[key] = false;
    }
  }
  client.quit();

  return values;
}

async function get(keys, group = "default") {
  const client = await createClient({
    url: `redis://${config.redis.dev.username}:${encodeURIComponent(
      config.redis.dev.password
    )}@${config.redis.dev.host}:${config.redis.dev.port}/0`,
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
  const values = {};

  for (const key of keys) {
    const cacheKey = getCacheKey(key, group);
    const result = await client.get(cacheKey);
    if (result !== null) {
      await client.expire(cacheKey, 7 * 24 * 60 * 60);
      values[key] = JSON.parse(result);
    } else {
      values[key] = false;
    }
  }
  client.quit();

  return values;
}

async function del(keys, group = "default") {
  const client = await createClient({
    url: `redis://${config.redis.dev.username}:${encodeURIComponent(
      config.redis.dev.password
    )}@${config.redis.dev.host}:${config.redis.dev.port}/0`,
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
  const values = {};
  for (const key of keys) {
    const cacheKey = getCacheKey(key, group);
    const result = await client.get(cacheKey);
    if (result !== null) {
      values[key] = await client.del(cacheKey);
    } else {
      values[key] = false;
    }
  }
  client.quit();

  return values;
}

async function decr(key, offset = 1, group = "default") {
  const client = await createClient({
    url: `redis://${config.redis.dev.username}:${encodeURIComponent(
      config.redis.dev.password
    )}@${config.redis.dev.host}:${config.redis.dev.port}/0`,
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  const cacheKey = getCacheKey(key, group);

  const result = await client.get(cacheKey);
  if (result !== null) {
    const newValue = Math.max(0, parseInt(result, 10) - offset);
    await client.set(cacheKey, newValue);
    await client.expire(cacheKey, 7 * 24 * 60 * 60);

    client.quit();

    return newValue;
  } else {
    client.quit();
    return false;
  }
}

async function incr(key, offset = 1, group = "default") {
  const client = await createClient({
    url: `redis://${config.redis.dev.username}:${encodeURIComponent(
      config.redis.dev.password
    )}@${config.redis.dev.host}:${config.redis.dev.port}/0`,
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  const cacheKey = getCacheKey(key, group);

  const result = await client.get(cacheKey);
  if (result !== null) {
    const newValue = Math.max(0, parseInt(result, 10) + offset);
    await client.set(cacheKey, newValue);
    await client.expire(cacheKey, 7 * 24 * 60 * 60);

    client.quit();

    return newValue;
  } else {
    client.quit();
    return false;
  }
}

async function flushGroup(group) {
  const client = await createClient({
    url: `redis://${config.redis.dev.username}:${encodeURIComponent(
      config.redis.dev.password
    )}@${config.redis.dev.host}:${config.redis.dev.port}/0`,
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  // Delete all keys with the specified group prefix
  const keys = await client.keys(`${group}:*`);
  if (keys.length > 0) {
    await client.del(...keys);
  }
  client.quit();
  return true;
}

async function flush() {
  const client = await createClient({
    url: `redis://${config.redis.dev.username}:${encodeURIComponent(
      config.redis.dev.password
    )}@${config.redis.dev.host}:${config.redis.dev.port}/0`,
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
  // Flush all data in the Redis database
  var result = await client.flushdb();
  client.quit();
  return result;
}

/**
 * Adds data to the Redis cache if the key does not already exist.
 *
 * @param {string} key - The key to use for storing the data in the cache.
 * @param {*} data - The data to store in the cache.
 * @param {string} [group='default'] - The cache group to which the key belongs.
 * @returns {Promise<boolean>} - True if the data was added to the cache, false if the key already exists.
 */

async function cacheAdd(key, data, group = "default") {
  var dt = {};
  dt[key] = data;
  var result = await set(dt, group);
  return result[key];
}

/**
 * Adds multiple key-value pairs to the Redis cache.
 *
 * @param {Object} data - An object containing key-value pairs to be added to the cache.
 * @param {string} [group=''] - The cache group to which the keys belong.
 * @returns {Promise<Object>} - An object indicating success or failure for each key-value pair.
 */
async function cacheAddMultiple(data, group = "") {
  return await set(data, group);
}
/**
 * Replaces the data in the Redis cache with new data if the key already exists.
 *
 * @param {string} key - The key to use for replacing the data in the cache.
 * @param {*} data - The new data to store in the cache.
 * @param {string} [group='default'] - The cache group to which the key belongs.
 * @returns {Promise<boolean>} - True if the data was replaced in the cache, false if the key does not exist.
 */
async function cacheReplace(key, data, group = "default") {
  var dt = {};
  dt[key] = data;
  var result = await replace(dt, group);
  return result[key];
}

/**
 * Sets the data contents into the Redis cache with an optional expiration time.
 *
 * @param {string} key - The key to use for storing the data in the cache.
 * @param {*} data - The data to store in the cache.
 * @param {string} [group='default'] - The cache group to which the key belongs.
 * @returns {Promise<boolean>} - True if the data was successfully set in the cache.
 */
async function cacheSet(key, data, group = "default") {
  var dt = {};
  dt[key] = data;
  var result = await set(dt, group);
  return result[key];
}

/**
 * Sets multiple key-value pairs into the Redis cache with an optional expiration time.
 *
 * @param {Object} data - An object containing key-value pairs to be set in the cache.
 * @param {string} [group=''] - The cache group to which the keys belong.
 * @returns {Promise<Object>} - An object indicating success or failure for each key-value pair.
 */
async function cacheSetMultiple(data, group = "") {
  return await set(data, group);
}

/**
 * Retrieves the data from the Redis cache using the specified key.
 *
 * @param {string} key - The key used for retrieving the data from the cache.
 * @param {string} [group='default'] - The cache group to which the key belongs.
 * @returns {Promise<*>} - The data from the cache, or false if the key does not exist.
 */
async function cacheGet(key, group = "default") {
  var keys = [];
  keys.push(key);
  var result = await get(keys, group);
  return result[key];
}

/**
 * Retrieves multiple data values from the Redis cache using an array of keys.
 *
 * @param {string[]} keys - An array of keys used for retrieving data from the cache.
 * @param {string} [group='default'] - The cache group to which the keys belong.
 * @returns {Promise<Object>} - An object containing data for each key, or false if a key does not exist.
 */
async function cacheGetMultiple(keys, group = "default") {
  return await get(keys, group);
}

/**
 * Deletes the data associated with the specified key from the Redis cache.
 *
 * @param {string} key - The key for which to delete the data from the cache.
 * @param {string} [group='default'] - The cache group to which the key belongs.
 * @returns {Promise<boolean>} - True if the data was successfully deleted, false if the key does not exist.
 */
async function cacheDelete(key, group = "default") {
    var dt = {};
    dt[key] = data;
    var result = await del(dt, group);
    return result[key];
}

/**
 * Deletes multiple key-value pairs from the Redis cache using an array of keys.
 *
 * @param {string[]} keys - An array of keys for which to delete data from the cache.
 * @param {string} [group=''] - The cache group to which the keys belong.
 * @returns {Promise<Object>} - An object indicating success or failure for each key-value pair.
 */
async function cacheDeleteMultiple(keys, group = "") {
    return await del(keys, group);
}

/**
 * Increments the numeric value of a key in the Redis cache.
 *
 * @param {string} key - The key for which to increment the numeric value.
 * @param {number} [offset=1] - The amount by which to increment the numeric value.
 * @param {string} [group='default'] - The cache group to which the key belongs.
 * @returns {Promise<number|boolean>} - The new numeric value on success, false on failure.
 */
async function cacheIncr(key, offset = 1, group = "default") {
  return await incr(key, offset, group);
}

/**
 * Decrements the numeric value of a key in the Redis cache.
 *
 * @param {string} key - The key for which to decrement the numeric value.
 * @param {number} [offset=1] - The amount by which to decrement the numeric value.
 * @param {string} [group='default'] - The cache group to which the key belongs.
 * @returns {Promise<number|boolean>} - The new numeric value on success, false on failure.
 */
async function cacheDescr(key, offset = 1, group = "default") {
    return await decr(key, offset, group);
}

/**
 * Removes all cache items in a specific group from the Redis cache.
 *
 * @param {string} group - The name of the cache group to remove from the cache.
 * @returns {Promise<boolean>} - True if the cache group was successfully cleared.
 */
async function cacheFlushGroup(group) {
  return await flushGroup(group);
}

module.exports = {
  cacheAdd,
  cacheAddMultiple,
  cacheReplace,
  cacheSet,
  cacheSetMultiple,
  cacheGet,
  cacheGetMultiple,
  cacheDelete,
  cacheDeleteMultiple,
  cacheIncr,
  cacheDescr,
  cacheFlushGroup,
};
 