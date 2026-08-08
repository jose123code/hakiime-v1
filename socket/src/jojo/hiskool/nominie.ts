import { Repository,Entity } from "redis-om";
import { nominiesRepository } from "../../connection/redis_om";
import { asyncWrap } from "../../utils";
import db from "../../connection/mysqlDb";


export interface Nominie {
  id: number;
  categ_id: number;
  name: string;
  avatar: string;
  code: string;
  votes: number;
  award_id: number;
}

class NominiesDataManager {

  private repo: Repository;

  public constructor() {
    this.repo = nominiesRepository;
    asyncWrap(async (repo) => {
      await repo.createIndex();
    }, this.repo);
  }

  // Insert data into categories
  public async insert(nominie:Nominie): Promise<void> {
    await this.repo.save(nominie.code+"_"+nominie.categ_id, nominie as unknown as Entity)

  }

  /**
   * update
   */
  public async updateVote(code:string,categ:number, vt:number = 1) {
    const nomin = await this.repo.fetch(code+"_"+categ);
          nomin.votes = parseInt(nomin.votes as unknown as string) + vt
          await this.repo.save(nomin);
          await db.update('award_nominies', { 'votes': nomin.votes }).where('code =?',code).execute<any>();

  }

  /**
   * getNominie
   */
  public async getNominie(code:string):Promise<Nominie|null> {
    const nominie = this.repo.search().where('code').is.equalTo(code).return.first();
    if(nominie) return nominie as unknown as Nominie;
    else return null;
  }


}

// Example usage:
export const nominieDataManager = new NominiesDataManager();