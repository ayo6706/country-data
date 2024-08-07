import axios from "axios";

const REST_COUNTRIES_API = "https://restcountries.com/v3.1/all";

export default async function fetchCountriesData() {
    try {
        const response = await axios.get(REST_COUNTRIES_API);
        return response.data;
    } catch (error) {
        throw error;
    }
}
