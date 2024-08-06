import { RegionDto } from "../dto/country.dto";
import { CountryRepository } from "../repository/country/country.repository"
import { failedPromise } from "./util";

export default class RegionService {
  constructor(private readonly repo: CountryRepository) { }
  async getAllRegions(): Promise<RegionDto[]> {
    try {
      const results = await this.repo.getRegions();
      return results
    } catch (error) {
      return failedPromise(error)
    }
  }
}