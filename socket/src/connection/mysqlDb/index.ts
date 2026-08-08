import * as mysql from 'mysql';
import QueryBuilder from './QueryBuilder';
import config from '../../config';

export class DatabaseManager {
    private pool: mysql.Pool;
    public prefix: string = '';

    /**
     * close
     */
    public close() {
      this.pool.end()
    }
  
    constructor() {
      this.pool = mysql.createPool(config.mysqlOptions);
      this.pool.on('enqueue', function () {
        console.log('Waiting for available connection slot');
      });

      this.pool.on('release', function (connection) {
        console.log('Connection %d released', connection.threadId);
      });
    }
  
    private async query<T>(sql: string, values?: any[]): Promise<T[]|T> {
      return new Promise((resolve, reject) => {
        this.pool.getConnection((err, connection) => {
          if (err) {
            reject(err);
            return;
          }
    
          connection.beginTransaction((beginTransactionErr) => {
            if (beginTransactionErr) {
              connection.release();
              reject(beginTransactionErr);
              return;
            }
    
            const regex = /"([^"]+)"|(\d+)/g;
            const escapedSql = sql.replace(regex, (_, stringValue, numberValue) => {
              if (stringValue) {
                return connection.escape(stringValue);
              } else if (numberValue) {
                return numberValue;
              } else {
                return _;
              }
            });
    
            connection.query({
              sql: escapedSql,
              timeout: 40000,
              values: values
            }, (queryError, results, fields) => {
              if (queryError) {
                connection.rollback(() => {
                  connection.release();
                  reject(queryError);
                });
              } else {
                connection.commit((commitError) => {
                  if (commitError) {
                    connection.rollback(() => {
                      connection.release();
                      reject(commitError);
                    });
                  } else {
                    connection.release();
                    resolve(results);
                  }
                });
              }
            });
          });
        });
      });
    }
    
    public setPrefix(prefix:string): DatabaseManager {
        this.prefix = prefix;
        return this;
    }
  
    private selectBuilder(table: string, columns: string = '*'): string {
      return `SELECT ${columns} FROM ${table}`;
    }

    private updateBuilder(table: string, data: Record<string, any>): { sql: string, values: any[] } {
      const columns = Object.keys(data).map(column => `${column} = ?`).join(', ');
      const values = Object.values(data);
      
      let sql = `UPDATE ${table} SET ${columns}`;
     
      return {
          sql,
          values
      };
  }
  
    public async insert(table: string, data: Record<string, any>): Promise<any> {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = values.map(() => '?').join(',');
        
        const query = `INSERT INTO ${table} (${columns.join(',')}) VALUES (${placeholders})`;
        const result = await this.query<any>(query,values);
        return result;
      }
    select(table: string, columns: string = '*'): QueryBuilder {
        const queryBuilder = new QueryBuilder();
        queryBuilder.setDatabaseManager(this);
        queryBuilder.setConditions(this.selectBuilder(table, columns));
        return queryBuilder;
    }

    update(table: string,data: Record<string, any>): QueryBuilder {
        const queryBuilder = new QueryBuilder();
        queryBuilder.setDatabaseManager(this);
        const up = this.updateBuilder(table, data);
        queryBuilder.setConditions(up.sql,up.values);
        return queryBuilder;
    }
    
    join(table: string, onCondition: string): QueryBuilder {
        const queryBuilder = new QueryBuilder();
        queryBuilder.setDatabaseManager(this);
        queryBuilder.setConditions(`INNER JOIN ${table} ON ${onCondition}`);
        return queryBuilder;
    }
  
    async execute(query: string, values?: any[]): Promise<any[]> {
        return await this.query<any>(query,values);
      }
  }

  const Db = new DatabaseManager();
  export const closeMysql = () => {
    Db.close();
  }
  
  export default Db;