import { FilterQuery } from "mongoose";
import Country, { CountryQuery } from "./models";

export interface CountryRepository{
    createAndUpdateCountries<T extends Partial<Country>>(
        updates: { filter: FilterQuery<Country>; update: T }[],
        upsert?: boolean
    ): Promise<void>
}