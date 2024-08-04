import { FilterQuery } from "mongoose";
import CountryModel from "./model.mongo";
import Country, { CountryQuery } from "./models";
import { CountryRepository } from "./country.repository";
import { log } from "../log";
import DatabaseError from "../../errors/database";
export default class CountryRepositoryMongo implements CountryRepository {

  async createAndUpdateCountries<T extends Partial<Country>>(
    updates: { filter: FilterQuery<Country>; update: T }[],
    upsert: boolean = false
  ): Promise<void> {
    try {
      const bulkOps = updates.map(({ filter, update }) => ({
        updateOne: {
          filter,
          update: { $set: update },
          upsert
        }
      }));

      await CountryModel.bulkWrite(bulkOps);

    } catch (error: any) {
      log.error(error);
      throw new DatabaseError(error);
    }
  }

  async findCountries(
    query: CountryQuery,
    page: number,
    limit: number
  ): Promise<Country[]> {
    try {
      const skip = (page - 1) * limit;
      const countries = await CountryModel.find(query)
        .limit(limit)
        .skip(skip)
        .exec();
      return countries;
    } catch (error: any) {
      log.error(error);
      throw new DatabaseError(error);
    }
  }
}