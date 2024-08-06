import { StatisticsDto } from '../dto/country.dto';
import CountryMapper from '../dto/country.mapper';
import { CountryRepository } from '../repository/country/country.repository';
import { failedPromise } from './util';

export default class StatisticsService {
  constructor(private readonly repo: CountryRepository) { }

  async getStatistics(): Promise<StatisticsDto> {
    try {
      const totalCountries = await this.repo.getTotalCountries()
      const largestCountry = await this.repo.getLargestCountry();
      const smallestCountry = await this.repo.getSmallestCountry();
      const mostSpokenLanguage = await this.repo.getMostSpokenLanguage();
      return CountryMapper.toStatisticsDto(
        totalCountries,
        largestCountry,
        smallestCountry,
        mostSpokenLanguage
      )
    } catch (error: any) {
      return failedPromise(error)
    }
  }
}