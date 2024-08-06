import Country from "../repository/country/models";
import CountryDto, { CountriesDto } from "./country.dto";

export default class CountryMapper {
    static toCountryDto(country: Country): CountryDto {
        return {
            id: country.id,
            name: country.name,
            population: country.population,
            capital: country.capital,
            area: country.area,
            alpha3Code: country.alpha3Code,
            region: country.region,
            subregion: country.subregion,
            languages: country.languages,
            borders: country.borders as string[]
        }
    }

    static toCountriesDto(
        countries: Country[],
        totalPages: number,
        currentPage: number
    ): CountriesDto {
        const countriesDto = countries.map(country => CountryMapper.toCountryDto(country));
        return {
            countries: countriesDto,
            totalPages,
            currentPage
        };
    }

    static toCountryDetailsDto(country: Country): CountryDto {
        const borders = country.borders.map(border => CountryMapper.toCountryDto(border as Country))
        return{
            id: country.id,
            name: country.name,
            population: country.population,
            capital: country.capital,
            area: country.area,
            alpha3Code: country.alpha3Code,
            region: country.region,
            subregion: country.subregion,
            languages: country.languages,
            borders: borders as CountryDto[]
        }
    }
}