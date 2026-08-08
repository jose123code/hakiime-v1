
// import {
//   createClient,
// } from 'redis';
// import {createPool, Factory, Pool}  from 'generic-pool';
// import { logger } from '../logger';
// import { asyncWrap } from '../utils';
// import {  RedisConnection } from 'redis-om';
// import config from "../config";

// const log = (st:string) => logger.info(st);

// const client = createClient({
//   url:'redis://'+config.redisOptions.username+':'+config.redisOptions.password+'@'+config.redisOptions.host+':'+config.redisOptions.port
// });

//   const poolConfig = {
//     max: 30, // Maximum number of connections in the pool
//     min: 2,  // Minimum number of connections to keep in the pool
//     idleTimeoutMillis: 30000, // How long a connection can remain idle before being removed
//   };
//     // Factory function to create Redis clients
//     const factory: Factory<RedisConnection> = {
//       create: async ():Promise<RedisConnection> => {
//         log('create');
      
//         client.on('error', (err) => {
//           throw new Error(err);
//         });
//         client.on('ready', () => {
//           log('ready');
//         });
//         log('connecting');
//         await client.connect();

//         return client;
//       },
//       destroy: async (client):Promise<void> => {
//         await client.quit();
//       }
//     };

// const pool = createPool(factory, poolConfig);

// export const CLient = client;


// export default pool;