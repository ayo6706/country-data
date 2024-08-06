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
