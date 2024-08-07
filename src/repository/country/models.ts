export interface CountryQuery {
    region?: string;
    population?: {
        $gte?: number;
        $lte?: number;
    };
}

export default interface Country {
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
    borders: string[] | Country[];
}

export interface Region {
    countries: Partial<Country>[];
    totalPopulation: number;
    region: string;
}

export interface Language {
    countries: Partial<Country>[],
    totalSpeakers: number,
    language: string
}
