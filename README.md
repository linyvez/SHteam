# SHteam (Steam for Shaders)

SHteam is a specialized platform for discovering, testing, and collecting WebGL shaders. Think of it as Steam, but built specifically for graphics developers. Users can preview shaders in a live 3D environment, purchase them for their own projects, and interact with a community of creators.

## Architecture (Microservices)

- Identity Service: Handles authentication and profiles. Powered by NestJS, PostgreSQL (user data), and Redis (session management/failover).

- Catalog Service: Manages shader metadata and search using MongoDB for flexible storage of GLSL code.

- Order Service: Manages purchases and transaction history. Uses Kafka for asynchronous processing and Cassandra for fast event logging.

- Social Service: Manages user connections and recommendations. Built with Neo4j (GraphDB) to handle complex many-to-many relationships.

## Requirements

- Node >=22.15.1
- npm >=10.9.2

## How to Run

1. Run Docker:

```
docker-compose up --build -d
```

2. Access the platform:

- http://localhost:5173

### Gateway failover test

0. Log in.

1. Kill one of the identity services:

```
docker stop shteam-identity-1
```

2. Go back to the website - session should stay the same, so there will be no need to login again.
