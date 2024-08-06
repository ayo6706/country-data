export default interface CountryDto {
  id?: string;
  _id?: string;
  name: string;
  capital: string;
  population: number;
  area: number;
  alpha3Code: string;
  region: string;
  subregion: string;
  languages: string[];
  borders: string[] | CountryDto[];
}

export interface CountriesDto {
  countries: CountryDto[],
  totalPages: number,
  currentPage: number
}

export interface UpdateFilter {
  filter: { _id: string };
  update: { borders: string[] };
}