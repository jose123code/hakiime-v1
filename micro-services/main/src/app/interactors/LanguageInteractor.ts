import { Language } from "../entities/Language";
import { 
  ILanguageInteractor,
  ILanguageRepository 
} from "../../interfaces";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";

@injectable()
export class LanguageInteractor implements ILanguageInteractor {
  private repository: ILanguageRepository;

  constructor(
    @inject(INTERFACE_TYPE.LanguageRepository)  repository: ILanguageRepository
  ) {
    this.repository = repository;
  }
  async createLanguage(data: Language) {
    const respData = await this.repository.create(data);
    // do some checks
    // run broker : notificationService
    return respData;
  }
  update(id: number, data: Language) {
    throw new Error("Method not implemented.");
  }
  checkToken(name: string) {
    throw new Error("Method not implemented.");
  }
  getLanguages(limit: number, offset: number) {
    throw new Error("Method not implemented.");
  }

  
}
