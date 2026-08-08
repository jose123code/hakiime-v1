import { Repository } from "redis-om";
import { Schema } from "redis-om";
import { createClient } from 'redis'
import { asyncWrap } from "../utils";
import config from "../config";

const redis = createClient({
  url:'redis://'+config.redisOptions.username+':'+config.redisOptions.password+'@'+config.redisOptions.host+':'+config.redisOptions.port
}
 )
redis.on('error', (err) => console.log('Redis Client Error', err));
asyncWrap(async (redis) => {
  await redis.connect();
}, redis);

export const quitRedis = () => {
  asyncWrap(async (redis) => {
    await redis.quit();
  }, redis);
}

export const Redis = redis;

const categorySchema = new Schema('categories', {
  id: { type: 'number' },
  category_id: { type: 'number' },
  name: { type: 'string' },
  link: { type: 'string' },
  members: { type: 'number' },
  votes: { type: 'number' },
  award_id: { type: 'number' },
  award_name: { type: 'string' },
  end_at: { type: 'string' },
});

const awardSchema = new Schema('awards', {
  id: { type: 'number' },
  categories: { type: 'number' },
  name: { type: 'string' },
  cover: { type: 'string' },
  members: { type: 'number' },
  votes: { type: 'number' },
  award_id: { type: 'number' },
  end_at: { type: 'string' },
});

const nomineeSchema = new Schema('nominies', {
  id: { type: 'number' },
  award_id: { type: 'number' },
  name: { type: 'string' },
  avatar: { type: 'string' },
  code: { type: 'string' },
  votes: { type: 'number' },
  categ_id: { type: 'number' },
});

const votesSchema = new Schema('votes', {
  user_id: { type: 'number' },
  categ_id: { type: 'number' },
  nominie_code: { type: 'string' },
  votes: { type: 'number' },
  created_at: { type: 'string' },
  updated_at: { type: 'string' },
  deleted_at: { type: 'string' },
});

const onlinesSchema = new Schema('onlines', {
  userId: { type: 'string' },
  username: { type: 'string' },
  socketId: { type: 'string' },
  isOnline: { type: 'boolean' },
  lastSeen: { type: 'string' }
});

export const categoriesRepository = new Repository(categorySchema, redis);
export const awardsRepository = new Repository(awardSchema, redis);
export const nominiesRepository = new Repository(nomineeSchema, redis);
export const onlinesRepository = new Repository(onlinesSchema, redis);
export const votesRepository = new Repository(votesSchema, redis);