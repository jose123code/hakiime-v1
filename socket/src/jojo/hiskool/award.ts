import { Repository,Entity } from "redis-om";
import { awardsRepository,quitRedis } from "../../connection/redis_om";
import { asyncWrap } from "../../utils";
import db from "../../connection/mysqlDb";


export interface Award {
  id: number;
  categories: number;
  name: string;
  cover: string;
  members: number;
  votes: number;
  award_id: number;
  end_at: string;
}

class AwardDataManager {

  private repo: Repository;

  public constructor() {
    this.repo = awardsRepository;
    asyncWrap(async (repo) => {
      await repo.createIndex();
    }, this.repo);
  }

  // Insert data into categories
  public async insert(award:Award): Promise<void> {
    await this.repo.save(award.award_id+"", award as unknown as Entity)

  }
  /**
     * update
     */
  public async updateVote(award:number,vt:number = 1) {
    const award_info = await this.repo.fetch(award+"");
          const v = parseInt(award_info.votes as unknown as string) + vt;
          award_info.votes = v;
          await this.repo.save(award_info);

          await db.update('Award_info', { 'votes': v }).where('award_id =?',award).execute();

  }

}

// Example usage:
export const awardDataManager = new AwardDataManager();