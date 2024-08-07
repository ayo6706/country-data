import { LanguageDto } from "../dto/country.dto";
import { CountryRepository } from "../repository/country/country.repository";
import failedPromise from "./util";

export default class LanguageService {
    constructor(private readonly repo: CountryRepository) { }

    async getLanguages(): Promise<LanguageDto[]> {
        try {
            const result = await this.repo.getLanguages();
            return result;
        } catch (error: any) {
            return failedPromise(error);
        }
    }
}
