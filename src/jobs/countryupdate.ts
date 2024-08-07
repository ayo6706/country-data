import { log } from "../log";
import CountryRepositoryMongo from "../repository/country/country.mongo";
import CountryService from "../services/country";

export async function CountryUpdateToDB() {
    try {
        await new CountryService(new CountryRepositoryMongo()).fetchAndStoreCountries();
    } catch (error) {
        log.error(error);
    }
}

export default async function initializeData() {
    const countryCount = await new CountryRepositoryMongo().getTotalCountries();
    if (countryCount === 0) {
        try {
            await CountryUpdateToDB();
            log.info("initial data population completed");
        } catch (error) {
            log.error("error during initial data population:", error);
        }
    } else {
        log.info("data already exists in the database");
    }
}
