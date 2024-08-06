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

  async getTotalCountries(query: CountryQuery): Promise<number>{
    try{
      const count = await CountryModel.countDocuments(query);
      return count
    }catch(error: any){
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

  async findCountryById(id: string): Promise<Country> {
    try {
      const result = await CountryModel.findById(id).populate('borders');
      return <Country>result
    } catch (error: any) {
      log.error(error);
      throw new DatabaseError(error);
    }
  }

  async getRegions(): Promise<any> {
    try {
      return await CountryModel.aggregate([
        {
          $group: {
            _id: '$region',
            countries: { $push: { name: '$name', population: '$population' } },
            totalPopulation: { $sum: '$population' }
          }
        },
        {
          $project: {
            region: '$_id',
            countries: 1,
            totalPopulation: 1,
            _id: 0
          }
        }
      ])

    } catch (error: any) {
      log.error(error);
      throw new DatabaseError(error);
    }
  }

  async getLanguages(): Promise<any> {
    try {
      return await CountryModel.aggregate([
        { $unwind: '$languages' },
        {
          $group: {
            _id: '$languages',
            countries: { $push: { name: '$name', population: '$population' } },
            totalSpeakers: { $sum: '$population' }
          }
        },
        {
          $project: {
            language: '$_id',
            countries: 1,
            totalSpeakers: 1,
            _id: 0
          }
        },
        { $sort: { totalSpeakers: -1 } }
      ]);

    } catch (error: any) {
      log.error(error)
      throw new DatabaseError(error)
    }
  }

  async getLargestCountry(): Promise<any> {
    try {
      const largestCountry = await CountryModel.findOne().sort('-area').select('name area');
      return largestCountry;
    } catch (error: any) {
      log.error(error)
      throw new DatabaseError(error)
    }
  }

  async getSmallestCountry(): Promise<any> {
    try {
      const smallestCountry = await CountryModel.findOne().sort('population').select('name population');
      return smallestCountry;
    } catch (error: any) {
      log.error(error)
      throw new DatabaseError(error)
    }
  }

  async getMostSpokenLanguage(): Promise<any> {
    try {
      const mostSpokenLanguage = await CountryModel.aggregate([
        { $unwind: '$languages' },
        {
          $group: {
            _id: '$languages',
            totalSpeakers: { $sum: '$population' }
          }
        },
        { $sort: { totalSpeakers: -1 } },
        { $limit: 1 }
      ]);
      return mostSpokenLanguage
    } catch (error: any) {
      log.error(error)
      throw new DatabaseError(error)
    }
  }
}