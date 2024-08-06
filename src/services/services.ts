import CountryService from "./country";
import LanguageService from "./language";
import RegionService from "./region";
import StatisticsService from "./statistics";

export interface Services {
    countryService: CountryService,
    regionService: RegionService,
    languageService: LanguageService
    statisticsService: StatisticsService
}
