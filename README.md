# Countries API

This is a REST API built with Node.js and TypeScript that integrates data from the REST Countries API. It provides information about countries, regions, languages, and various statistics.

## Features

- Fetch and store country data from the REST Countries API
- Provide endpoints for countries, regions, languages, and statistics
- Implement caching using Redis for improved performance
- Use MongoDB for data storage
- Include logging with Winston
- Implement rate limiting to prevent abuse
- Provide API documentation using Swagger/OpenAPI
- Include unit and integration tests
- Input validation and sanitization
- Deployable to AWS Lambda

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     ```
4. Run the application locally: `npm start:dev`
5. Run tests: `npm test`

## API Endpoints

- GET /api/countries: Retrieve a list of countries with pagination and optional filtering
- GET /api/countries/:id: Retrieve detailed information for a specific country
- GET /api/regions: Retrieve a list of regions and the countries within each region
- GET /api/languages: Retrieve a list of languages and the countries where they are spoken
- GET /api/statistics: Provide aggregated statistics

For detailed API documentation, visit `/api-docs` when the server is running locally.

## Deployment to AWS Lambda

1. Install the Serverless Framework globally: `npm install -g serverless`
2. Configure your AWS credentials: `aws configure`
3. Set up your environment variables in AWS Systems Manager Parameter Store:
   - Go to AWS Systems Manager > Parameter Store
   - Create parameters for MONGODB_URI and REDIS_URL with the naming convention:
     - /countries-api/dev/MONGODB_URI
     - /countries-api/dev/REDIS_URL
4. Deploy the application: `npm run deploy`

After deployment, Serverless will provide you with the API Gateway endpoint URL.

## Implementation Approach

This project follows a modular architecture with separate routes, controllers, and models. It uses TypeScript for type safety and better developer experience. The application implements caching with Redis to improve performance and reduce load on the database.

## Challenges and Interesting Features

- Implementing efficient data processing for statistics and aggregations
- Setting up caching to balance between data freshness and performance
- Designing a flexible filtering system for the countries endpoint
- Adapting the application for serverless deployment on AWS Lambda

## Potential Improvements

- Implement GraphQL API alongside REST for more flexible querying
- Add more comprehensive test coverage
- Implement a worker system for periodic data updates from the REST Countries API
- Add authentication and rate limiting per user

For any questions or issues, please open an issue in the GitHub repository.