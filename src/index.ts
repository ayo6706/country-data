import config from "config";
import { initLoggers, connectToDatabase, setupGracefulShutdown, createApp } from "./app";

const PORT = config.get<string>("PORT");

async function main() {
    initLoggers();
    await connectToDatabase();
    setupGracefulShutdown();

    const app = createApp();
    app.serve(process.env.PORT || PORT);
}

main().catch((error) => {
    console.error("Failed to start the application:", error);
    process.exit(1);
});