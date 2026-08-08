import { Repository,Entity } from "redis-om";
import { votesRepository,Redis } from "../../connection/redis_om";
import { asyncWrap } from "../../utils";
import db from "../../connection/mysqlDb";


import moment from "moment";
import { logger } from "../../logger";

export interface Vote {
    user_id: number;
    categ_id: number;
    nominie_code: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    votes: number;
  }

class VoteDataManager {

  private repo: Repository;

  public constructor() {
    this.repo = votesRepository;
    asyncWrap(async (repo) => {
      await repo.createIndex();
    }, this.repo);
  }

  private async checkVote(user_id:number,category:number):Promise<number>{
    return await Redis.exists('votes:'+user_id+'_'+category);
  }


  async vote(userId: number,category_id:number,code:string,award:number, vt:number = 1): Promise<boolean> {
    const exists = await this.checkVote(userId,category_id);
    logger.info("Check user if not yet vote in this category");
    
    if(exists != 0){
    logger.info("Check user if not yet vote in this category: TRUE");

      return false;
    }else{
      logger.info("Check user if not yet vote in this category: FALSE");
    
        const vote: Vote = {
            user_id:userId,
            categ_id:category_id,
            nominie_code:code,
            votes: vt,
            created_at: moment().utc().format(),
            updated_at: moment().utc().format(),
            deleted_at: ""
        };
        await this.repo.save(userId+'_'+category_id,vote as unknown as Entity)

        const data1 = {
          'user_id': userId,
          'award_id': award,
          'categ_id': category_id,
          'nominie_code': code,
          'total_votes': vt
        };
       await db.insert('award_vote', data1);
        // await this.repo.expire(userId+"", 7 * 24 * 60 * 60);
        return true;
    }
  }


}

// Example usage:
export const voteDataManager = new VoteDataManager();