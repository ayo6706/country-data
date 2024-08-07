import config from "config";
import {
    initLoggers, connectToDatabase, setupGracefulShutdown, createApp,
} from "./app";
import initializeData from "./jobs/countryupdate";
import { log } from "./log";

const PORT = config.get<string>("PORT");

async function main() {
    initLoggers();
    await connectToDatabase();
    setupGracefulShutdown();

    const app = createApp();
    app.serve(process.env.PORT || PORT);
    initializeData();
    log.info("application initialized");
}

main().catch((error) => {
    log.error("failed to start the application:", error);
    process.exit(1);
});
