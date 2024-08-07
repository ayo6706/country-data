import { Handler } from 'aws-lambda';
import serverless from 'serverless-http';
import { initLoggers, connectToDatabase, createApp } from './app';

let app: any;

export const handler: Handler = async (event, context) => {
    if (!app) {
        initLoggers();
        await connectToDatabase();
        app = createApp().serve(process.env.PORT || '3000');
    }

    const handler = serverless(app);
    return handler(event, context);
};