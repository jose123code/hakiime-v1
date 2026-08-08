import db from "../connection/mysqlDb";
import { nominieDataManager } from "./hiskool/nominie";
import { voteDataManager } from "./hiskool/vote";
import { categoryDataManager } from "./hiskool/category";
import { awardDataManager } from "./hiskool/award";
import { logger } from "../logger";


  
 export async function vote(nomineeCode: string, userId: number): Promise<boolean|{categ:number;name:string;}> {
    logger.info("Check nominie existance");
    
    const nomin = await nominieDataManager.getNominie(nomineeCode);
    
    if(nomin){
       logger.info("Nominie found");

       const categ_info = await categoryDataManager.getCateg(nomin.categ_id)
       const vot = await voteDataManager.vote(userId,nomin.categ_id,nomineeCode,nomin.award_id)
       if(vot){
        logger.info("Update nomonie: START");

         await nominieDataManager.updateVote(nomineeCode,nomin.categ_id);
        logger.info("Update nomonie: DONE");

         if(categ_info){
            logger.info("Update category: START");

            await categoryDataManager.updateVote(nomin.award_id,nomin.categ_id);
            logger.info("Update category: DONE");
            
            logger.info("Update award: START");
            
            await awardDataManager.updateVote(nomin.award_id);
            return {
               categ:nomin.categ_id,
               name:nomin.name
            };
         }
       }
    }

    return false;
    
  }
  
export  async function voteFake(nomineeCode: string, vote: number): Promise<boolean> {
    const nomin = await nominieDataManager.getNominie(nomineeCode);

    if(nomin){
       const categ_info = await categoryDataManager.getCateg(nomin.categ_id)
        const fk = await db.select('Fake_votes').where('code =?',nomineeCode).getOne<any>();
        if(fk){
           await db.update('Fake_votes', { 'votes': (fk.votes as number) + vote }).where('code =?',nomineeCode).execute();
        }else{
            await db.insert('Fake_votes', {
                        'votes': vote,
                        'code': nomineeCode,
                    });
            await nominieDataManager.updateVote(nomineeCode,nomin.categ_id,vote);
            if(categ_info){
                await categoryDataManager.updateVote(nomin.award_id,nomin.categ_id,vote);
                await awardDataManager.updateVote(nomin.award_id,vote);
                return true;
            }
        }
    }
   return false;

  }
  