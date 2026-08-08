import { inject, injectable } from "inversify";
import { Types, Document } from "mongoose";

import { Developer } from "../entities/Developer";
import { 
  IDeveloperInteractor,
  IDeveloperRepository,
  IDeveloper
} from "../../interfaces";
import { INTERFACE_TYPE } from "../../utils";
import { BadRequestError } from "../../common";

/**
 * Interactor responsible for handling developer-related business logic.
 */
@injectable()
export class DeveloperInteractor implements IDeveloperInteractor {
  private repository: IDeveloperRepository;

  constructor(
    @inject(INTERFACE_TYPE.DeveloperRepository) repository: IDeveloperRepository
  ) {
    this.repository = repository;
  }

  /**
   * Creates a new developer if the provided phone and email are unique.
   * @param data Developer data.
   * @returns Newly created developer.
   * @throws BadRequestError if email or phone already exist.
   */
  async createDeveloper(data: Developer): Promise<(Document<unknown, {}, IDeveloper> & IDeveloper & {
    _id: Types.ObjectId;
  }) | null> {
    if (await this.isPhoneUnique(data.phone)) {
      if (await this.isEmailUnique(data.email)) {
        const respData = await this.repository.create(data);
        // Additional logic can be added here
        return respData;
      } else {
        throw new BadRequestError('User with this email already exists!');
      }
    } else {
      throw new BadRequestError('User with this phone number already exists!');
    }
  }

  async updateDeveloper(doc:Document<unknown, {}, IDeveloper> & IDeveloper & {
    _id: Types.ObjectId;
  }):Promise<void>{
    await this.repository.update(doc)
  }

  /**
   * Checks if the provided phone number is unique.
   * @param phone Phone number to check.
   * @returns True if phone number is unique, otherwise false.
   */
  async isPhoneUnique(phone: number): Promise<boolean> {
    const dev = await this.getDeveloperPhone(phone);
    return !dev;
  }

  /**
   * Checks if the provided email is unique.
   * @param email Email to check.
   * @returns True if email is unique, otherwise false.
   */
  async isEmailUnique(email: string): Promise<boolean> {
    const dev = await this.getDeveloperEmail(email);
    return !dev;
  }

  /**
   * Retrieves a developer by their ID.
   * @param developerId ID of the developer.
   * @returns Developer if found, otherwise null.
   */
  async getDeveloper(developerId: string): Promise<(Document<unknown, {}, IDeveloper> & IDeveloper & {
    _id: Types.ObjectId;
  }) | null> {
    return await this.repository.findDeveloper(developerId);
  }

  /**
   * Retrieves a developer by their email.
   * @param developerEmail Email of the developer.
   * @returns Developer if found, otherwise null.
   */
  async getDeveloperEmail(developerEmail: string): Promise<(Document<unknown, {}, IDeveloper> & IDeveloper & {
    _id: Types.ObjectId;
  }) | null> {
    return await this.repository.findDeveloperEmail(developerEmail);
  }

  /**
   * Retrieves a developer by their phone number.
   * @param developerPhone Phone number of the developer.
   * @returns Developer if found, otherwise null.
   */
  async getDeveloperPhone(developerPhone: number): Promise<(Document<unknown, {}, IDeveloper> & IDeveloper & {
    _id: Types.ObjectId;
  }) | null> {
    return await this.repository.findDeveloperPhone(developerPhone);
  }

  /**
   * Updates the applications of a developer.
   * @param id ID of the developer.
   * @param applicationId ID of the application to update.
   */
  async updateApplication(id: string, applicationId: string): Promise<void> {
    await this.repository.updateApplication(id, applicationId);
  }

  update(id: number, data: Developer) {
    throw new Error("Method not implemented.");
  }
  checkToken(name: string) {
    throw new Error("Method not implemented.");
  }
  getDevelopers(limit: number, offset: number) {
    throw new Error("Method not implemented.");
  }

  
}
