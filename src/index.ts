import config from "config";
import Http from "./http/http";
import { Services } from "./services/services";


const PORT = config.get<string>("PORT");
const API_VERSION = config.get<string>("API_VERSION");


function main(): void {
    const services: Services = {

    };

    const http = new Http(services);
    http.serve(process.env.PORT || PORT, API_VERSION);
}

main();
