import { Language } from "../../../app/entities/Language";

export interface ILanguageInteractor {
  createLanguage(data: Language);
  update(id: number, data: Language);
  checkToken(name: string);
  getLanguages(limit: number, offset: number);
}
