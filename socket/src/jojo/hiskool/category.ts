import { Repository,Entity } from "redis-om";
import { categoriesRepository, quitRedis } from "../../connection/redis_om";
import { asyncWrap } from "../../utils";
import db from "../../connection/mysqlDb";



export interface Category {
  id: number;
  category_id: number;
  name: string;
  link: string;
  members: number;
  votes: number;
  award_id: number;
  award_name: string;
  end_at: string;
}


class CategoryDataManager {

    private repo: Repository;
  
    public constructor() {
      this.repo = categoriesRepository;
      asyncWrap(async (repo) => {
        await repo.createIndex();
      }, this.repo);
    }
  
    // Insert data into categories
    public async insert(categ:Category): Promise<void> {
      await this.repo.save(categ.category_id+"_"+categ.award_id, categ as unknown as Entity)

    }
     /**
     * update
     */
    public async updateVote(award:number,categ:number, vt:number = 1) {
      const categ_info = await this.repo.fetch(categ+"_"+award);
            const v = parseInt(categ_info.votes as unknown as string) + vt;
            categ_info.votes = v;
            await this.repo.save(categ_info);

            await  db.update('Category_info', { 'votes': v }).where('category_id =?',categ_info.category_id).execute();
    }

    /**
     * getNominie
     */
    public async getCateg(categ:number):Promise<Category|null> {
      const categ_info = this.repo.search().where('category_id').is.equalTo(categ).return.first();
      if(categ_info) return categ_info as unknown as Category;
      else return null;
    }

  }
  
  // Example usage:
  export const categoryDataManager = new CategoryDataManager();