import { Language } from "../../../app/entities/Language";
import { ILanguage } from "../ILanguage";

export interface ILanguageRepository {
  create(data: Language): Promise<ILanguage | null>;
  update(id: number, data: Language): Promise<Language>;
  find(limit: number, offset: number): Promise<Language[]>;
}
