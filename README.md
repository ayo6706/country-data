# Countries API

This is a REST API built with Node.js and TypeScript that integrates data from the REST Countries API. It provides information about countries, regions, languages, and various statistics.

## Live Demo

The API is deployed and accessible at:
https://i84rl2w9kb.execute-api.us-east-1.amazonaws.com/dev/api/api-docs

## Features

- Fetch and store country data from the REST Countries API
- Provide endpoints for countries, regions, languages, and statistics
- Use MongoDB for data storage
- Include logging with Winston
- Provide API documentation using Swagger/OpenAPI
- Include unit and integration tests
- Input validation and sanitization
- Deployable to AWS Lambda
- Automatic data updates using node-cron

## Technologies Used

- Node.js
- TypeScript
- Express.js
- MongoDB
- AWS Lambda
- Serverless Framework
- Jest for testing
- Swagger for API documentation
- node-cron for scheduled tasks

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/ayo6706/country-data.git
   cd country-data
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     DBUri=your_mongodb_connection_string
     ```
     or make use of the config directory,  the defaults data are already being provided.
4. Run the application locally:
   ```
   npm run start:dev
   ```
5. Run tests:
   ```
   npm run test
   ```

## API Endpoints

- GET /api/countries: Retrieve a list of countries with pagination and optional filtering
- GET /api/countries/:id: Retrieve detailed information for a specific country
- GET /api/regions: Retrieve a list of regions and the countries within each region
- GET /api/languages: Retrieve a list of languages and the countries where they are spoken
- GET /api/statistics: Provide aggregated statistics

For detailed API documentation, visit `/api-docs` when the server is running locally or append `/api-docs` to the live demo URL.

## Deployment to AWS Lambda

1. Install the Serverless Framework globally:
   ```
   npm install -g serverless
   ```
2. Configure your AWS credentials:
   ```
   aws configure
   ```
3. Set up your environment variables in AWS Systems Manager Parameter Store:
   - Go to AWS Systems Manager > Parameter Store
   - Create a parameter for DBUri
4. Deploy the application:
   ```
   npm run deploy:prod
   ```

After deployment, Serverless will provide you with the API Gateway endpoint URL.

## Implementation Approach

This project follows a modular architecture. It uses TypeScript for type safety and better developer experience. 

Key architectural decisions:
- Use of Repository pattern for database operations
- Implementation of Service layer for business logic
- Error handling middleware for consistent error responses
- Initial data population on application start
- Scheduled data updates using node-cron

## Data Management

- On initial startup, the application fetches data from the REST Countries API and populates the MongoDB database.
- A scheduled task using node-cron updates the data every midnight to ensure the information remains current.

## Challenges and Interesting Features

- Implementing efficient data processing for statistics and aggregations
- Designing a flexible filtering system for the countries endpoint
- Adapting the application for serverless deployment on AWS Lambda
- Implementing periodic data updates from the REST Countries API using node-cron

## Performance Optimizations

- Efficient database queries using MongoDB aggregation pipeline
- Serverless deployment for automatic scaling
- Pagination of large result sets

## Security Measures

- Input validation and sanitization using express-validator
- Use of environment variables for sensitive information
- CORS configuration to restrict access to API


## Potential Improvements

- Implement GraphQL API alongside REST for more flexible querying
- Add more comprehensive test coverage, including performance tests
- Add authentication and rate limiting per user
- Implement caching mechanisms to reduce database load
- Add monitoring and alerting for the production environment

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

For any questions or issues, please open an issue in the GitHub repository.
