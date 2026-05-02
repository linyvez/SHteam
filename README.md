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

1. Install dependencies from the root folder:

```
npm install
```

2. Start the development environment:

```
npm run dev
```

3. Access the platform:

- Frontend: http://localhost:5173
- Identity API: http://localhost:3000
