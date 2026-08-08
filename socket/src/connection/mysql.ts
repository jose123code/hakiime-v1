
import { logger } from '../logger';
import { Award, Category, Nominie, awardDataManager, categoryDataManager, nominieDataManager } from '../jojo';
import { asyncWrap, cleanRepetitiveFileName } from '../utils';
import DatabaseManager from './mysqlConn';

import mysqlDb from "./mysqlDb";


export function syncCategoriesFromDb(): void {
  
  const sqlQuery = `SELECT * FROM Category_info`;

  DatabaseManager.query(sqlQuery, []).then(data=>{
    data.forEach((mysqlResult) => {
      const cat: Category = {
          id: mysqlResult.id,
          category_id: mysqlResult.category_id,
          name: mysqlResult.name,
          link: mysqlResult.link,
          members: mysqlResult.members,
          votes: mysqlResult.votes,
          award_id: mysqlResult.award_id,
          award_name: mysqlResult.award_name,
          end_at: mysqlResult.end_at
      };
      const exec ={
        manager: categoryDataManager,
        data: cat
      };
      asyncWrap(async (exec) => {
        await exec.manager.insert(exec.data);
      }, exec);
  })

  // Convert each row into a JSON object and add to the list
  

    // await categoryDataManager.insert(cat);
    

  });

}

export async function syncAwardsFromDb2(): Promise<void> {
  
  const sqlQuery = `SELECT * FROM Award_info`;
  const data = await mysqlDb.select('award_nominies').where('code = ?','76d9244f6c9b8b44766c').getOne<any>();
 
  logger.info(data);

}

export async function syncAwardsFromDb(): Promise<void> {
  
  const sqlQuery = `SELECT * FROM Award_info`;

  const data = await DatabaseManager.query(sqlQuery, []);


  // Convert each row into a JSON object and add to the list
  data.forEach((mysqlResult) => {
    const awar: Award = {
        id: mysqlResult.id,
        categories: mysqlResult.categories,
        name: mysqlResult.name,
        cover: mysqlResult.cover,
        members: mysqlResult.members,
        votes: mysqlResult.votes,
        award_id: mysqlResult.award_id,
        end_at: mysqlResult.end_at
    };

    const exec ={
      manager: awardDataManager,
      data: awar
    };
    asyncWrap(async (exec) => {
      await exec.manager.insert(exec.data);
    }, exec);

    // await categoryDataManager.insert(cat);
    

  });

}


export async function syncNominiesFromDb(): Promise<void> {
  
  const sqlQuery = `SELECT * FROM award_nominies`;

  const data = await DatabaseManager.query(sqlQuery, []);

  // Convert each row into a JSON object and add to the list
  data.forEach((mysqlResult) => {
    const nomin: Nominie = {
        id: mysqlResult.id,
        categ_id: mysqlResult.categ_id,
        name: cleanRepetitiveFileName(mysqlResult.name),
        avatar: mysqlResult.avatar,
        code: mysqlResult.code,
        votes: mysqlResult.votes,
        award_id: mysqlResult.award_id
    };
    const exec ={
      manager: nominieDataManager,
      data: nomin
    };
    asyncWrap(async (exec) => {
      await exec.manager.insert(exec.data);
    }, exec);

    // await categoryDataManager.insert(cat);
    

  });

}



