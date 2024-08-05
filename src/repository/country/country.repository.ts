import { FilterQuery } from "mongoose";
import Country, { CountryQuery } from "./models";

export interface CountryRepository{
    findCountries(
        query?: CountryQuery, 
        page?: number, 
        limit?: number
    ): Promise<Country[]>
    findCountryById(id: string): Promise<Country>
    createAndUpdateCountries<T extends Partial<Country>>(
        updates: { filter: FilterQuery<Country>; update: T }[],
        upsert?: boolean
    ): Promise<void>
    getLargestCountry(): Promise<any>
}