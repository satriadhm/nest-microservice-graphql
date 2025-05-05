# NestJS Microservice GraphQL Application

This project demonstrates a microservice architecture using NestJS, GraphQL with Apollo Federation, and PostgreSQL. It consists of three main services:

1. **Gateway Service** - API Gateway that routes requests to appropriate microservices using Apollo Federation
2. **Applicants Service** - Manages applicant data
3. **Parsers Service** - Handles file uploads (primarily CSV files) and processes them

### Key Features

- **Microservice Architecture**: Services communicate via GraphQL using Apollo Federation
- **Database Integration**: Each service has its own PostgreSQL database
- **File Processing**: Upload and process CSV files through GraphQL or REST endpoints
- **Email Notifications**: Send email notifications when files are processed
- **Docker Support**: Easy deployment with Docker Compose

## Technology Stack

- **Backend**: NestJS, TypeScript
- **API**: GraphQL (Apollo Federation), REST
- **Database**: PostgreSQL, TypeORM
- **File Processing**: CSV Parser
- **Notifications**: Nodemailer
- **Containerization**: Docker, Docker Compose

## Project Structure

```
satriadhm-nest-microservice-graphql/
├── apps/
│   ├── gateway/         # API Gateway service
│   ├── applicants/      # Applicant management service
│   └── parsers/         # File processing service
├── docker/              # Docker configuration files
├── uploads/             # Uploaded files directory
└── docker-compose.yml   # Docker Compose configuration
```

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- PostgreSQL (or Docker for containerized setup)
- Redis (or Docker for containerized setup)

## Installation and Setup

### Local Development

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/satriadhm-nest-microservice-graphql.git
cd satriadhm-nest-microservice-graphql
```

2. **Install dependencies**

```bash
npm install
```

3. **Create environment files**

Create `.env` files in each service directory:

- `apps/gateway/.env`
- `apps/applicants/.env`
- `apps/parsers/.env`

Example `.env` file content:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=service_db

# Redis Configuration (if needed)
REDIS_HOST=localhost
REDIS_PORT=6379

# Service URLs (for gateway)
APPLICANTS_SERVICE_URL=http://localhost:3001/graphql
PARSERS_SERVICE_URL=http://localhost:3002/graphql

# Email Configuration (for parsers service)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password

# Port Configuration
PORT=3000  # 3000 for gateway, 3001 for applicants, 3002 for parsers
```

4. **Start the services**

```bash
# Start all services in development mode
npm run start:dev

# Or start individual services
npm run start:applicants
npm run start:parsers
npm run start
```

### Docker Deployment

1. **Build and start the Docker containers**

```bash
# Build the containers
npm run docker:build

# Start the containers
npm run docker:up
```

2. **Stop the Docker containers**

```bash
npm run docker:down
```

## API Documentation

### GraphQL APIs

Once the services are running, you can access the GraphQL playground:

- Gateway: http://localhost:3000/graphql
- Applicants Service: http://localhost:3001/graphql
- Parsers Service: http://localhost:3002/graphql

### Sample Queries and Mutations

#### Applicants Service

```graphql
# Create a new applicant
mutation {
  createApplicant(createApplicantInput: {
    id: "1"
    email: "john@example.com"
    name: "John Doe"
    age: 30
    address: "123 Main St"
    country: "USA"
    city: "New York"
  }) {
    id
    name
    email
  }
}

# Query all applicants
query {
  applicants {
    id
    name
    email
    age
    address
    country
    city
  }
}

# Query a specific applicant
query {
  applicant(id: "1") {
    id
    name
    email
  }
}
```

#### Parsers Service

```graphql
# Upload and parse a file
mutation ($file: Upload!) {
  uploadAndParseFile(file: $file)
}

# Query all parsers
query {
  parsers {
    id
    fileName
    processed
    valid
    uploadedAt
    processedAt
  }
}
```

### REST APIs

The parsers service also exposes REST endpoints for file upload:

- `POST /file-upload` - Upload a file for processing
- `GET /file-upload/:id` - Get details about a processed file
- `GET /file-upload/download/:id` - Download the processed data

## Testing

### Unit Tests

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:cov
```

### End-to-End Tests

```bash
# Run e2e tests
npm run test:e2e
```

## File Processing Workflow

1. A CSV file is uploaded through GraphQL or REST API
2. The file is stored on the server
3. The CSV file is parsed
4. The data is validated (checking for required fields)
5. If valid, the data is enriched with additional information
6. The results are stored in the database
7. Email notifications are sent about the processing outcome
8. The processed data can be downloaded or queried through the API

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.