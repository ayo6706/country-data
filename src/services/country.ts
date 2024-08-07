import CountryDto, { CountriesDto, UpdateFilter } from "../dto/country.dto";
import CountryMapper from "../dto/country.mapper";
import * as errors from "../errors/services";
import fetchCountriesData from "../lib";
import { CountryRepository } from "../repository/country/country.repository";
import { failedPromise } from "./util";

export default class CountryService {
  constructor(
    private readonly repo: CountryRepository
  ) { }

  async fetchAndStoreCountries(): Promise<void> {
    try {
      const countriesData = await fetchCountriesData();
      const countryUpserts = countriesData.map((countryData: any) => ({
        filter: { alpha3Code: countryData.cca3 },
        update: {
          name: countryData.name.common,
          capital: countryData.capital ? countryData.capital[0] : 'N/A',
          population: countryData.population,
          area: countryData.area,
          region: countryData.region,
          subregion: countryData.subregion,
          languages: countryData.languages ? Object.values(countryData.languages) : [],
          alpha3Code: countryData.cca3,
        }
      }));

      await this.repo.createAndUpdateCountries(countryUpserts, true);

      const borderUpdates = await this.prepareBorderUpdates(countriesData);
      await this.repo.createAndUpdateCountries(borderUpdates);
    } catch (error) {
      throw error;
    }
  }

  private async prepareBorderUpdates(
    countriesData: any[]
  ): Promise<UpdateFilter[]> {
    const codeToId = new Map<string, string>();
    const updates: UpdateFilter[] = [];

    // get all countries from the database to map codes to IDs
    const allCountries = await this.repo.findCountries();
    allCountries.forEach(country => codeToId.set(country.alpha3Code, country.id!));

    // Prepare updates
    for (const countryData of countriesData) {
      if (countryData.borders && countryData.borders.length > 0) {
        const countryId = codeToId.get(countryData.cca3);
        if (countryId) {
          const borderIds = countryData.borders
            .map((borderCode: string) => codeToId.get(borderCode))
            .filter(Boolean);
          updates.push({
            filter: { _id: countryId },
            update: { borders: borderIds as string[] }
          });
        }
      }
    }
    return updates;
  }

  async getCountries(
    region?: string,
    minPopulation?: number,
    maxPopulation?: number,
    page: number = 1,
    limit: number = 10
  ): Promise<CountriesDto> {
    try {
      const query: any = {};

      if (region) {
        query.region = region;
      }

      if (minPopulation || maxPopulation) {
        query.population = {};
        if (minPopulation) query.population.$gte = minPopulation;
        if (maxPopulation) query.population.$lte = maxPopulation;
      }

      const countries = await this.repo.findCountries(query, page, limit);
      const count = await this.repo.getTotalCountries(query)
      const totalPages = Math.ceil(count / limit)
      return CountryMapper.toCountriesDto(
        countries,
        totalPages,
        page
      );
    } catch (error: any) {
      return failedPromise(error);
    }
  }

  async getCountryCountryDetails(id: string): Promise<CountryDto> {
    try {
      const country = await this.repo.findCountryById(id);
      if (!country) {
        return failedPromise(errors.ErrCountryDoesNotExist)
      }
      return CountryMapper.toCountryDetailsDto(country)
    } catch (error: any) {
      return failedPromise(error)
    }
  }
}
