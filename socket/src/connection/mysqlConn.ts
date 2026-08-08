import { createPool, Pool, Factory } from 'generic-pool';
import * as mysql from 'mysql';
import { asyncWrap } from '../utils';
import config from '../config';

class DatabaseManager {
  private pool: Pool<mysql.Connection>;

  constructor() {
    const factory: Factory<mysql.Connection> = {
      create: async () => {
        const connection = mysql.createConnection(config.mysqlOptions);
        await connection.connect();
        return connection;
      },
      destroy: async (connection: mysql.Connection) => {
        await connection.end();
      },
    };

    const poolConfig = {
      max: 10,
      min: 2,
    };

    this.pool = createPool(factory, poolConfig);
  }

  public async query(sqlQuery: string, params: any[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.pool.acquire()
        .then(connection => {
          connection.query(sqlQuery, params, (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
            this.pool.release(connection);
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public async close(): Promise<void> {
    await this.pool.drain();
    await this.pool.clear();
  }
}

const conn = new DatabaseManager()

export const closeMysql = () => {
  asyncWrap(async (conn) => {
    await conn.close();
  }, conn);
}
export default conn;
