import { Repository,Entity } from "redis-om";
import { onlinesRepository,Redis } from "../../connection/redis_om";
import { asyncWrap,calculateTimeDiff } from "../../utils";

import moment from "moment";

export interface OnlineStatus {
    userId: string;
    socketId: string;
    username: string;
    isOnline: boolean;
    lastSeen: string;
  }

class OnlinesDataManager {

  private repo: Repository;

  public constructor() {
    this.repo = onlinesRepository;
    asyncWrap(async (repo) => {
      await repo.createIndex();
    }, this.repo);
  }


  async setUserOnline(userId: string,username:string,socketId:string): Promise<void> {
    const exists = await Redis.exists('onlines:'+userId);
    if(exists != 0){
        const status = await this.repo.fetch(userId+"");
              status.isOnline = true;
              status.socketId = socketId;
              status.lastSeen = moment().utc().format();

              await this.repo.save(status);
              await this.repo.expire(userId+"", 7 * 24 * 60 * 60);

    }else{
    
        const status: OnlineStatus = {
            userId,
            socketId,
            username,
            isOnline: true,
            lastSeen: moment().utc().format(),
        };
        await this.repo.save(userId+"",status as unknown as Entity)
        await this.repo.expire(userId+"", 7 * 24 * 60 * 60);
    }
  }

  async setUserOffline(userId: string,socketId:string): Promise<void> {
    const exists = await Redis.exists('onlines:'+userId);
    
    if(exists != 0){
        const status = await this.repo.fetch(userId+"");
              status.isOnline = false;
              status.socketId = socketId;
              status.lastSeen = moment().utc().format();

              await this.repo.save(status);
              await this.repo.expire(userId+"", 7 * 24 * 60 * 60);

    }
  }
  
  async delUser(userId: string): Promise<void> {
    await this.repo.remove(userId+"");
  }

  async getUserStatus(userId: string): Promise<OnlineStatus | null> {
    const exists = await Redis.exists('onlines:'+userId);
    
    if(exists != 0){
        const status = await this.repo.fetch(userId+"");
        const lastSeen = moment(status.lastSeen as unknown as any).utc();
        const now = moment().utc();
        status.lastSeen = calculateTimeDiff(now, lastSeen);
        return status as unknown as OnlineStatus;

    }else return null;
    
  }

  async updateUserStatus(userId: string, username:string,socketId:string, isOnline: boolean): Promise<void> {
    if(isOnline) await this.setUserOnline(userId,username,socketId);
    else await this.setUserOffline(userId,socketId);
  }
  async getAllOnlineUsers(): Promise<OnlineStatus[]> {
    const statuses = await this.repo.search().return.all();
    const statusList: OnlineStatus[] = [];

//     const persons = await personRepository.search().where('lastName').is.equalTo(lastName).return.all()
// const persons = await personRepository.search().where('lastName').does.equal(lastName).return.all()

    if (statuses.length === 0) {
      return statusList;
    }
    return statuses as unknown[] as OnlineStatus[];
  }

  

}

// Example usage:
export const onlineDataManager = new OnlinesDataManager();