import { Handler } from "aws-lambda";
import serverless from "serverless-http";
import { initLoggers, connectToDatabase, createApp } from "./app";
import initializeData from "./jobs/countryupdate";
import { log } from "./log";

let app: any;
let dbInitialized = false;
let dataInitialized = false;

const handler: Handler = async (event, context) => {
    if (!app) {
        initLoggers();

        if (!dbInitialized) {
            log.info("connecting to database");
            try {
                await connectToDatabase();
                log.info("database connected successully");
                dbInitialized = true;
            } catch (error) {
                log.error("connecting to database failed", error);
                throw error;
            }
        }

        if (!dataInitialized) {
            log.info("initializing data");
            await initializeData();
            log.info("data initialized");
            dataInitialized = true;
        }
        app = createApp().serve(process.env.PORT || "3000");
    }

    const handlerInit = serverless(app);
    return handlerInit(event, context);
};

export default handler;
