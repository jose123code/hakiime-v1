import {DatabaseManager} from "./";

class QueryBuilder {
  private conditions: string = '';
  private values: any[] = [];
  private start: number = 0;
  private end: number = 100;
  private parPage: number = 100;
  private pageNumber: number = 1;
  private whereNum:number = 0;
  private totalRows:number = 0;
  private withTotalCountFlag: boolean = false;
  private databaseManager: DatabaseManager | null = null;

  public paginate(page: number): QueryBuilder {
    this.pageNumber = page;
    if(page > 1){
      this.start = this.parPage * page;
      this.end  = this.start + this.parPage;
    }
    return this;
  }
  public setParPage(parPage: number): QueryBuilder {
    this.parPage = parPage;
    return this.paginate(this.pageNumber);
  }
  public setDatabaseManager(databaseManager: DatabaseManager): void {
    this.databaseManager = databaseManager;
  }
  public rawAddPrefix(query: string): string {
    if (this.databaseManager) {
      query = query.replace(/\s+/g, ' ').trim();
      const regex = /(from|into|update|join|describe) ['´]?([a-zA-Z0-9_-]+)['´]?/gi;
      const matches = query.matchAll(regex);
      const tableNames: string[] = [];
  
      for (const match of matches) {
          const [, from, table] = match;
          tableNames.push(table);
      }
  
      const replacedQuery = query.replace(tableNames[0], this.databaseManager.prefix + tableNames[0]);
      return replacedQuery;
    }else {
      throw new Error('DatabaseManager instance not set in QueryBuilder.');
    }
   
}



  public async rawQuery<T>(query: string, bindParams?: any[]): Promise<T[]|null> {
    const sql = this.rawAddPrefix(query);
    return this.results<T>(await this.query<T>(sql, bindParams));
  }

  public async rawQueryOne<T>(query: string, bindParams?: any[]): Promise<T|null> {
    const result = await this.rawQuery<T>(query, bindParams);
    if(result) return result.length > 0 ? result[0] : null;
    
    return null;
  }

  public async rawQueryValue<T>(query: string, bindParams?: any[]): Promise<T|null> {
    const result = await this.rawQuery<T>(query, bindParams);
    if(result){
      if (result.length > 0 && typeof (result as unknown as any[])[0] === 'object') {
          const keys = Object.keys((result as unknown as any[])[0]);
          if (keys.length > 0) {
            return (result as unknown as any[])[0] [keys[0]] as T;
          }
        
      }
    }
    return null;
  }

  private async query<T>(query: string, bindParams?: any[], numRows?: number | [number, number]): Promise<T[]|null> {
    const [start, end] = Array.isArray(numRows) ? numRows : [0, numRows || 0];
    const limit = start || end ? `LIMIT ${start},${end - start}` : '';
    const sql = this.rawAddPrefix(`${query} ${limit}`);
    if (this.databaseManager) {
        return this.databaseManager.execute(sql, bindParams?bindParams:[]);
    } else {
      throw new Error('DatabaseManager instance not set in QueryBuilder.');
    }
  }

 

  public withTotalCount(): QueryBuilder {
    this.withTotalCountFlag = true;
    return this;
  }

  private results<T>(results:T[]|null):T[]|null{
    if (results) {
      if(this.withTotalCountFlag){
        this.totalRows = results.length;
         return results;
       }else return results;
    }
    return null;

  }


  public async get<T>(): Promise<T[]|null> {
    return this.results<T>(await this.execute<T>());
  }
  public async getOne<T>():Promise<T|null>{
    const result = await this.execute<T>();
    if(result){
      if (result.length > 0 ) {
            return (result as unknown as any[])[0] as T;        
      }
    }
    return null;
  }

  public async execute<T>(): Promise<T[]|null> {
    if (this.databaseManager) {
      const [conditions, values] = this.build();
      const sql = this.rawAddPrefix(conditions);

      return this.databaseManager.execute(sql, values);
    } else {
      throw new Error('DatabaseManager instance not set in QueryBuilder.');
    }
  }

  /**
   * name
   */
  public setConditions(conditions:string,values:any[] = []):QueryBuilder {
    if (this.conditions) {
      this.conditions += conditions;
    }else{
      this.conditions = conditions;
    }
    this.values.push(...values);
    return this;
  }
  public where(conditions: string, ...values: any[]): QueryBuilder {
    if(this.whereNum > 0){
        this.conditions += ' AND ';
        this.conditions += conditions;
    }else{
      this.whereNum =1;
      this.conditions += ' WHERE '+conditions;
    }
    this.values.push(...values);
        
    return this;
  }

  public orWhere(conditions: string, ...values: any[]): QueryBuilder {
    // if (this.conditions) {
      this.conditions += ' OR ';
    // }
    this.conditions += conditions;
    this.values.push(...values);
    return this;
  }

  public whereIn(column: string, values: any[]): QueryBuilder {
    if(this.whereNum>0){
      this.conditions += ' AND ';
    }else{
      this.whereNum =1;
      this.conditions = ' WHERE ';
    }
    const placeholders = values.map(() => '?').join(',');
    this.conditions += `${column} IN (${placeholders})`;
    this.values.push(...values);
    return this;
  }


  build(): [string, any[]] {
    return [this.conditions, this.values];
  }
}



export default QueryBuilder;
