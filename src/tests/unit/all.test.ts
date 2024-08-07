import CountryService from "../../services/country";
import LanguageService from "../../services/language";
import RegionService from "../../services/region";
import StatisticsService from "../../services/statistics";
import fetchCountriesData from "../../lib/country";
import { CountryRepository } from "../../repository/country/country.repository";
import Country from "../../repository/country/models";

jest.mock("../../lib/country");

describe("CountryService", () => {
    let countryService: CountryService;
    let mockRepo: jest.Mocked<CountryRepository>;

    beforeEach(() => {
        mockRepo = {
            createAndUpdateCountries: jest.fn(),
            findCountries: jest.fn(),
            getTotalCountries: jest.fn(),
            findCountryById: jest.fn(),
            getLanguages: jest.fn(),
            getRegions: jest.fn(),
            getLargestCountry: jest.fn(),
            getSmallestCountry: jest.fn(),
            getMostSpokenLanguage: jest.fn(),
        } as unknown as jest.Mocked<CountryRepository>;

        countryService = new CountryService(mockRepo);
    });

    describe("fetchAndStoreCountries", () => {
        it("should fetch and store countries successfully", async () => {
            const mockCountriesData = [
                {
                    cca3: "USA",
                    name: { common: "United States" },
                    capital: ["Washington, D.C."],
                    population: 331002651,
                    area: 9833517,
                    region: "Americas",
                    subregion: "North America",
                    languages: { eng: "English" },
                    borders: ["CAN", "MEX"],
                },
            ];

            (fetchCountriesData as jest.Mock).mockResolvedValue(mockCountriesData);
            mockRepo.createAndUpdateCountries.mockResolvedValue(undefined);
            mockRepo.findCountries.mockResolvedValue(mockCountriesData as unknown as Country[]);

            await countryService.fetchAndStoreCountries();

            expect(mockRepo.createAndUpdateCountries).toHaveBeenCalledTimes(2);
        });

        it("should handle API errors", async () => {
            (fetchCountriesData as jest.Mock).mockRejectedValue(new Error("API Error"));

            await expect(countryService.fetchAndStoreCountries()).rejects.toThrow("API Error");
        });
    });

    describe("getCountries", () => {
        it("should return countries based on filters", async () => {
            const mockCountries: Country[] = [
                {
                    name: "United States",
                    capital: "Washington, D.C.",
                    alpha3Code: "USA",
                    population: 331002651,
                    area: 9833517,
                    region: "Americas",
                    subregion: "Northern America",
                    languages: ["English"],
                    borders: ["CAN", "MEX"],
                },
            ];

            mockRepo.findCountries.mockResolvedValue(mockCountries);
            mockRepo.getTotalCountries.mockResolvedValue(mockCountries.length);

            const result = await countryService.getCountries("Americas", 1000000, 400000000, 1, 10);

            expect(result.countries.length).toBe(mockCountries.length);
            expect(result.totalPages).toBe(1);
            expect(mockRepo.findCountries).toHaveBeenCalledWith(
                expect.objectContaining({
                    region: "Americas",
                    population: { $gte: 1000000, $lte: 400000000 },
                }),
                1,
                10,
            );
        });

        it("should handle errors when fetching countries", async () => {
            mockRepo.findCountries.mockRejectedValue(new Error("Database error"));

            await expect(countryService.getCountries()).rejects.toThrow("Database error");
        });
    });

    describe("getCountryCountryDetails", () => {
        it("should return details for a specific country", async () => {
            const mockCountry: Country = {
                id: "1",
                name: "United States",
                capital: "Washington, D.C.",
                alpha3Code: "USA",
                population: 331002651,
                area: 9833517,
                region: "Americas",
                subregion: "Northern America",
                languages: ["English"],
                borders: ["CAN", "MEX"],
            };
            mockRepo.findCountryById.mockResolvedValue(mockCountry);

            const result = await countryService.getCountryCountryDetails(mockCountry.id!);

            expect(result.name).toBe(mockCountry.name);
            expect(mockRepo.findCountryById).toHaveBeenCalledWith(mockCountry.id);
        });
    });
});

describe("LanguageService", () => {
    let languageService: LanguageService;
    let mockRepo: jest.Mocked<CountryRepository>;

    beforeEach(() => {
        mockRepo = {
            getLanguages: jest.fn(),
        } as unknown as jest.Mocked<CountryRepository>;

        languageService = new LanguageService(mockRepo);
    });

    describe("getLanguages", () => {
        it("should return all languages", async () => {
            const mockLanguages = [
                { language: "English", countries: [{ name: "United States" }, { name: "United Kingdom" }], totalSpeakers: 1500000000 },
                { language: "French", countries: [{ name: "France" }, { name: "Canada" }], totalSpeakers: 280000000 },
            ];
            mockRepo.getLanguages.mockResolvedValue(mockLanguages);

            const result = await languageService.getLanguages();

            expect(result).toEqual(mockLanguages);
            expect(mockRepo.getLanguages).toHaveBeenCalled();
        });

        it("should handle errors when fetching languages", async () => {
            mockRepo.getLanguages.mockRejectedValue(new Error("Database error"));

            await expect(languageService.getLanguages()).rejects.toThrow("Database error");
        });
    });
});

describe("RegionService", () => {
    let regionService: RegionService;
    let mockRepo: jest.Mocked<CountryRepository>;

    beforeEach(() => {
        mockRepo = {
            getRegions: jest.fn(),
        } as unknown as jest.Mocked<CountryRepository>;

        regionService = new RegionService(mockRepo);
    });

    describe("getAllRegions", () => {
        it("should return all regions", async () => {
            const mockRegions = [
                { region: "Americas", countries: [{ name: "United States" }, { name: "Canada" }], totalPopulation: 369007889 },
                { region: "Europe", countries: [{ name: "France" }, { name: "Germany" }], totalPopulation: 150700000 },
            ];
            mockRepo.getRegions.mockResolvedValue(mockRegions);

            const result = await regionService.getAllRegions();

            expect(result).toEqual(mockRegions);
            expect(mockRepo.getRegions).toHaveBeenCalled();
        });

        it("should handle errors when fetching regions", async () => {
            mockRepo.getRegions.mockRejectedValue(new Error("Database error"));

            await expect(regionService.getAllRegions()).rejects.toThrow("Database error");
        });
    });
});

describe("StatisticsService", () => {
    let statisticsService: StatisticsService;
    let mockRepo: jest.Mocked<CountryRepository>;

    beforeEach(() => {
        mockRepo = {
            getTotalCountries: jest.fn(),
            getLargestCountry: jest.fn(),
            getSmallestCountry: jest.fn(),
            getMostSpokenLanguage: jest.fn(),
        } as unknown as jest.Mocked<CountryRepository>;

        statisticsService = new StatisticsService(mockRepo);
    });

    describe("getStatistics", () => {
        it("should return statistics", async () => {
            const mockTotalCountries = 195;
            const mockLargestCountry = {
                name: "Russia",
                area: 17098246,
                population: 145934462,
                capital: "Moscow",
                region: "Europe",
            };
            const mockSmallestCountry = {
                name: "Vatican City",
                population: 825,
                area: 0.44,
                capital: "Vatican City",
                region: "Europe",
            };
            const mockMostSpokenLanguage = [{
                _id: "Mandarin Chinese",
                totalSpeakers: 918000000,
            }];

            mockRepo.getTotalCountries.mockResolvedValue(mockTotalCountries);
            mockRepo.getLargestCountry.mockResolvedValue(mockLargestCountry);
            mockRepo.getSmallestCountry.mockResolvedValue(mockSmallestCountry);
            mockRepo.getMostSpokenLanguage.mockResolvedValue(mockMostSpokenLanguage);

            const result = await statisticsService.getStatistics();

            expect(result).toEqual({
                totalCountries: mockTotalCountries,
                largestCountry: {
                    name: mockLargestCountry.name,
                    area: mockLargestCountry.area,
                    population: mockLargestCountry.population,
                    capital: mockLargestCountry.capital,
                    region: mockLargestCountry.region,
                },
                smallestCountry: {
                    name: mockSmallestCountry.name,
                    area: mockSmallestCountry.area,
                    population: mockSmallestCountry.population,
                    capital: mockSmallestCountry.capital,
                    region: mockSmallestCountry.region,
                },
                mostSpokenLanguage: {
                    language: mockMostSpokenLanguage[0]._id,
                    totalSpeakers: mockMostSpokenLanguage[0].totalSpeakers,
                },
            });

            expect(mockRepo.getTotalCountries).toHaveBeenCalled();
            expect(mockRepo.getLargestCountry).toHaveBeenCalled();
            expect(mockRepo.getSmallestCountry).toHaveBeenCalled();
            expect(mockRepo.getMostSpokenLanguage).toHaveBeenCalled();
        });

        it("should handle errors when fetching statistics", async () => {
            mockRepo.getTotalCountries.mockRejectedValue(new Error("Database error"));

            await expect(statisticsService.getStatistics()).rejects.toThrow("Database error");
        });
    });
});
